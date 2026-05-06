const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

// Utility function for logging cart operations
const logCartOperation = (operation, data) => {
  console.log(`🛒 [${operation.toUpperCase()}]`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Improved transaction handler with better error reporting and timeout
const withTransaction = async (operation, session, maxRetries = 2, timeoutMs = 5000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Set transaction options with timeout
      const transactionOptions = {
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' },
        maxTimeMS: timeoutMs
      };

      session.startTransaction(transactionOptions);
      
      // Use Promise.race to add timeout protection
      const result = await Promise.race([
        operation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs)
        )
      ]);
      
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      lastError = err;
      
      console.warn(`Transaction attempt ${attempt} failed:`, err.message);
      
      // Don't retry on validation/AppError instances
      if (err instanceof AppError) {
        break;
      }
      
      // Only retry on specific errors
      if (err.code === 11000 || // Duplicate key
          err.message.includes('Transaction') || 
          err.message.includes('write conflict') ||
          err.message.includes('timeout') ||
          err.errorLabels?.includes('TransientTransactionError')) {
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
          continue;
        }
      }
      
      // Don't retry for other errors
      break;
    }
  }
  
  console.error(`Transaction failed after ${maxRetries} attempts`, lastError?.message);
  throw lastError instanceof AppError ? lastError : new AppError('Database operation failed. Please try again.', 409);
};

// Get user's cart with full details
exports.getCart = catchAsync(async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: 'coupon',
      select: 'code discountType discountValue validFrom validUntil minPurchase maxDiscount'
    })
    .populate({
      path: 'items.product',
      select: 'name price image countInStock status slug'
    });

  if (!cart) {
    return res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: [],
          subtotal: 0,
          itemCount: 0,
          discount: 0,
          total: 0
        }
      }
    });
  }

  // Calculate discount if coupon exists and is valid
  let discount = 0;
  if (cart.coupon && new Date(cart.coupon.validUntil) > new Date()) {
    if (cart.coupon.discountType === 'percentage') {
      discount = cart.subtotal * (cart.coupon.discountValue / 100);
      if (cart.coupon.maxDiscount) {
        discount = Math.min(discount, cart.coupon.maxDiscount);
      }
    } else {
      discount = Math.min(cart.coupon.discountValue, cart.subtotal);
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        id: cart._id,
        items: cart.items,
        subtotal: cart.subtotal,
        itemCount: cart.itemCount,
        discount,
        total: Math.max(0, cart.subtotal - discount),
        coupon: cart.coupon || null,
        updatedAt: cart.updatedAt
      }
    }
  });
});

// Add one or multiple items to cart
exports.addToCart = catchAsync(async (req, res, next) => {
  let { productId, quantity = 1, items } = req.body;

  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  // Normalize input: support both single item and bulk operations
  if (!items) {
    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }
    items = [{ productId, quantity }];
  }

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError('Items must be a non-empty array', 400));
  }

  const session = await mongoose.startSession();

  try {
    const result = await withTransaction(async () => {
      // Step 1: Validate all items
      const productIds = items.map(item => item.productId);
      const products = await Product.find({
        _id: { $in: productIds },
        status: 'active'
      }).session(session);

      // Check if all products exist
      const productMap = new Map();
      products.forEach(product => {
        productMap.set(product._id.toString(), product);
      });

      const missingProducts = productIds.filter(id => !productMap.has(id));
      if (missingProducts.length > 0) {
        throw new AppError(`Products not found: ${missingProducts.join(', ')}`, 404);
      }

      // Check stock availability
      const stockIssues = [];
      items.forEach(item => {
        const product = productMap.get(item.productId);
        if (product.countInStock < item.quantity) {
          stockIssues.push({
            productId: item.productId,
            productName: product.name,
            available: product.countInStock,
            requested: item.quantity
          });
        }
      });

      if (stockIssues.length > 0) {
        const errorMessage = stockIssues.map(issue => 
          `${issue.productName}: Only ${issue.available} available, requested ${issue.requested}`
        ).join('; ');
        throw new AppError(errorMessage, 400);
      }

      // Step 2: Find or create user cart
      let cart = await Cart.findOne({ user: req.user._id }).session(session);
      if (!cart) {
        cart = new Cart({
          user: req.user._id,
          items: []
        });
        await cart.save({ session });
      }

      // Step 3: Process each item
      const productUpdates = [];
      const updatedItems = [...cart.items];

      for (const item of items) {
        const { productId, quantity } = item;
        const product = productMap.get(productId);

        const existingItemIndex = updatedItems.findIndex(
          cartItem => cartItem.product.toString() === productId
        );

        if (existingItemIndex > -1) {
          // Update existing item
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
          updatedItems[existingItemIndex].quantity = newQuantity;
        } else {
          // Add new item
          updatedItems.push({
            product: productId,
            quantity,
            priceAtAddition: product.price,
            addedAt: new Date()
          });
        }

        // Prepare stock update
        productUpdates.push({
          updateOne: {
            filter: { _id: productId },
            update: { $inc: { countInStock: -quantity } }
          }
        });
      }

      // Step 4: Execute all updates
      if (productUpdates.length > 0) {
        await Product.bulkWrite(productUpdates, { session });
      }

      // Update cart
      cart.items = updatedItems;
      await cart.save({ session });

      // Return populated cart
      return await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name price image countInStock status slug'
        })
        .session(session);
    }, session);

    logCartOperation('ADD_ITEMS', {
      userId: req.user._id,
      itemsCount: items.length,
      cartId: result._id
    });

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          id: result._id,
          items: result.items,
          subtotal: result.subtotal,
          itemCount: result.itemCount,
          updatedAt: result.updatedAt
        }
      }
    });

  } catch (err) {
    console.error('Add to cart error:', err);
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('An error occurred while adding items to cart', 500));
  } finally {
    session.endSession();
  }
});

// Remove item from cart (FIXED VERSION)
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const productId = req.params.productId || req.params.id;

  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  if (!productId) {
    return next(new AppError('Product ID parameter is required', 400));
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError('Invalid product ID format', 400));
  }

  const session = await mongoose.startSession();

  try {
    const result = await withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id }).session(session);
      
      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );

      if (itemIndex === -1) {
        // Instead of throwing error, log it and return current cart
        console.warn(`Item ${productId} not found in cart for user ${req.user._id}, returning current cart state`);
        return await Cart.findById(cart._id)
          .populate({
            path: 'items.product',
            select: 'name price image countInStock status slug'
          })
          .session(session);
      }

      const removedItem = cart.items[itemIndex];
      
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
      await cart.save({ session });

      // Restore product stock
      await Product.findByIdAndUpdate(
        removedItem.product,
        { $inc: { countInStock: removedItem.quantity } },
        { session }
      );

      return await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name price image countInStock status slug'
        })
        .session(session);
    }, session);

    logCartOperation('REMOVE_ITEM', {
      userId: req.user._id,
      productId,
      cartId: result._id
    });

    res.status(200).json({
      status: 'success',
      message: 'Item removed successfully',
      data: {
        cart: {
          id: result._id,
          items: result.items,
          subtotal: result.subtotal,
          itemCount: result.itemCount,
          updatedAt: result.updatedAt
        }
      }
    });

  } catch (err) {
    console.error('Remove from cart error:', err);
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('An error occurred while removing item from cart', 500));
  } finally {
    session.endSession();
  }
});

// Update cart item quantities (FIXED VERSION)
exports.updateCartItems = catchAsync(async (req, res, next) => {
  const { items } = req.body;

  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  if (!Array.isArray(items)) {
    return next(new AppError('Items must be provided as an array', 400));
  }

  // Validate items before starting transaction
  for (const item of items) {
    if (!item.productId) {
      return next(new AppError('Product ID is required for all items', 400));
    }

    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      return next(new AppError(`Invalid product ID format: ${item.productId}`, 400));
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 0 || item.quantity > 100) {
      return next(new AppError(`Quantity must be an integer between 0 and 100 for product: ${item.productId}`, 400));
    }
  }

  const session = await mongoose.startSession();

  try {
    const updatedCart = await withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id }).session(session);
      
      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      // Verify all products exist and are active (only for items that will be updated/added)
      const productIds = items
        .filter(item => item.quantity > 0)
        .map(item => item.productId);
      
      if (productIds.length > 0) {
        const products = await Product.find({
          _id: { $in: productIds },
          status: 'active'
        }).session(session);

        // Create a map for quick lookup
        const productMap = new Map();
        products.forEach(product => {
          productMap.set(product._id.toString(), product);
        });

        // Check if all products exist
        const missingProducts = productIds.filter(id => !productMap.has(id));
        if (missingProducts.length > 0) {
          throw new AppError(`Products not found: ${missingProducts.join(', ')}`, 404);
        }
      }

      // Process updates
      const productUpdates = [];
      const updatedItems = [...cart.items];
      const itemsProcessed = [];

      // Process each update request
      for (const update of items) {
        const itemIndex = updatedItems.findIndex(
          item => {
            const itemProductId = item.product?._id?.toString() || item.product?.toString();
            return itemProductId === update.productId;
          }
        );

        if (itemIndex === -1) {
          // Skip items not in cart instead of throwing error
          console.warn(`Product ${update.productId} not found in cart for user ${req.user._id}, skipping update`);
          continue;
        }

        const currentQuantity = updatedItems[itemIndex].quantity;

        if (update.quantity === 0) {
          // Remove item if quantity is 0
          const removedItem = updatedItems.splice(itemIndex, 1)[0];
          productUpdates.push({
            updateOne: {
              filter: { _id: update.productId },
              update: { $inc: { countInStock: removedItem.quantity } }
            }
          });
          itemsProcessed.push({ productId: update.productId, action: 'removed' });
        } else {
          // Check stock for quantity increases
          if (update.quantity > currentQuantity) {
            const quantityIncrease = update.quantity - currentQuantity;
            const product = await Product.findById(update.productId).session(session);
            
            if (product && product.countInStock < quantityIncrease) {
              throw new AppError(
                `Not enough stock for product ${product.name}. Only ${product.countInStock} available`,
                400
              );
            }
          }

          // Update quantity
          const quantityDiff = update.quantity - currentQuantity;
          updatedItems[itemIndex].quantity = update.quantity;
          
          if (quantityDiff !== 0) {
            productUpdates.push({
              updateOne: {
                filter: { _id: update.productId },
                update: { $inc: { countInStock: -quantityDiff } }
              }
            });
          }
          itemsProcessed.push({ productId: update.productId, action: 'updated', newQuantity: update.quantity });
        }
      }

      // Apply all product stock updates
      if (productUpdates.length > 0) {
        await Product.bulkWrite(productUpdates, { session });
      }

      // Update cart only if there are changes
      if (itemsProcessed.length > 0) {
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: cart._id },
          { $set: { items: updatedItems } },
          { new: true, session }
        ).populate({
          path: 'items.product',
          select: 'name price image countInStock status slug'
        });

        return { cart: updatedCart, processedCount: itemsProcessed.length };
      }

      // Return original cart if no changes were made
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name price image countInStock status slug'
        })
        .session(session);
      
      return { cart: populatedCart, processedCount: 0 };
    }, session);

    logCartOperation('UPDATE_ITEMS', {
      userId: req.user._id,
      itemsRequested: items.length,
      itemsProcessed: updatedCart.processedCount
    });

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          id: updatedCart.cart._id,
          items: updatedCart.cart.items,
          subtotal: updatedCart.cart.subtotal,
          itemCount: updatedCart.cart.itemCount,
          updatedAt: updatedCart.cart.updatedAt
        }
      }
    });

  } catch (err) {
    console.error('Update cart items error:', err);
    
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('An error occurred while updating cart items', 500));
  } finally {
    session.endSession();
  }
});

// Clear entire cart
exports.clearCart = catchAsync(async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  const session = await mongoose.startSession();

  try {
    await withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id }).session(session);
      
      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      if (cart.items.length === 0) {
        return; // No need to proceed if cart is already empty
      }

      // Restore all product stock
      const bulkOps = cart.items.map(item => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { countInStock: item.quantity } }
        }
      }));

      await Product.bulkWrite(bulkOps, { session });

      // Clear cart items
      cart.items = [];
      await cart.save({ session });
    }, session);

    logCartOperation('CLEAR_CART', {
      userId: req.user._id
    });

    res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('An error occurred while clearing the cart', 500));
  } finally {
    session.endSession();
  }
});

// Apply coupon to cart
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { couponCode } = req.body;

  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  if (!couponCode) {
    return next(new AppError('Coupon code is required', 400));
  }

  const session = await mongoose.startSession();

  try {
    const cart = await withTransaction(async () => {
      const coupon = await Coupon.findOne({
        code: couponCode,
        active: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      }).session(session);

      if (!coupon) {
        throw new AppError('Invalid or expired coupon', 400);
      }

      // Get cart with current subtotal
      const cart = await Cart.findOne({ user: req.user._id })
        .session(session)
        .populate('items.product');

      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      // Check minimum purchase requirement
      if (coupon.minPurchase && cart.subtotal < coupon.minPurchase) {
        throw new AppError(
          `Minimum purchase of ${coupon.minPurchase} required for this coupon`,
          400
        );
      }

      // Apply coupon
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cart._id },
        { coupon: coupon._id },
        { new: true, session }
      ).populate(['items.product', 'coupon']);

      return updatedCart;
    }, session);

    // Calculate discount
    let discount = 0;
    if (cart.coupon.discountType === 'percentage') {
      discount = cart.subtotal * (cart.coupon.discountValue / 100);
      if (cart.coupon.maxDiscount) {
        discount = Math.min(discount, cart.coupon.maxDiscount);
      }
    } else {
      discount = Math.min(cart.coupon.discountValue, cart.subtotal);
    }

    logCartOperation('APPLY_COUPON', {
      userId: req.user._id,
      couponCode,
      discount
    });

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          id: cart._id,
          items: cart.items,
          subtotal: cart.subtotal,
          itemCount: cart.itemCount,
          discount,
          total: Math.max(0, cart.subtotal - discount),
          coupon: cart.coupon,
          updatedAt: cart.updatedAt
        }
      }
    });

  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('An error occurred while applying coupon', 500));
  } finally {
    session.endSession();
  }
});

// Remove coupon from cart
exports.removeCoupon = catchAsync(async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    return next(new AppError('Authentication required', 401));
  }

  const session = await mongoose.startSession();

  try {
    const cart = await withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id })
        .session(session)
        .populate('items.product');

      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      if (!cart.coupon) {
        return cart; // No coupon to remove
      }

      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $unset: { coupon: "" } },
        { new: true, session }
      ).populate('items.product');

      return updatedCart;
    }, session);

    logCartOperation('REMOVE_COUPON', {
      userId: req.user._id
    });

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          id: cart._id,
          items: cart.items,
          subtotal: cart.subtotal,
          itemCount: cart.itemCount,
          discount: 0,
          total: cart.subtotal,
          coupon: null,
          updatedAt: cart.updatedAt
        }
      }
    });

  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    next(new AppError('An error occurred while removing coupon', 500));
  } finally {
    session.endSession();
  }
});
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

const CART_POPULATE = {
  path: 'items.product',
  select: 'name price image images countInStock status'
};

// Get user's cart
exports.getCart = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  const cart = await Cart.findOne({ user: req.user._id })
    .populate(CART_POPULATE)
    .populate({ path: 'coupon', select: 'code discountType discountValue validFrom validUntil minPurchase maxDiscount' });

  if (!cart) {
    return res.status(200).json({
      status: 'success',
      data: { cart: { items: [], subtotal: 0, itemCount: 0, discount: 0, total: 0 } }
    });
  }

  let discount = 0;
  if (cart.coupon && new Date(cart.coupon.validUntil) > new Date()) {
    if (cart.coupon.discountType === 'percentage') {
      discount = cart.subtotal * (cart.coupon.discountValue / 100);
      if (cart.coupon.maxDiscount) discount = Math.min(discount, cart.coupon.maxDiscount);
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

// Add item(s) to cart
exports.addToCart = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  let { productId, quantity = 1, items } = req.body;

  if (!items) {
    if (!productId) return next(new AppError('Product ID is required', 400));
    items = [{ productId, quantity }];
  }

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError('Items must be a non-empty array', 400));
  }

  // Validate products exist and are active
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, status: 'active' });

  const productMap = new Map(products.map(p => [p._id.toString(), p]));

  const missing = productIds.filter(id => !productMap.has(id));
  if (missing.length > 0) {
    return next(new AppError(`Products not found: ${missing.join(', ')}`, 404));
  }

  // Upsert cart (safe against duplicate key race)
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id, items: [] } },
    { upsert: true, new: true }
  );

  // Apply updates
  for (const item of items) {
    const existingIdx = cart.items.findIndex(
      ci => ci.product.toString() === item.productId
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += item.quantity;
    } else {
      const product = productMap.get(item.productId);
      cart.items.push({
        product: item.productId,
        quantity: item.quantity,
        priceAtAddition: product.price,
        addedAt: new Date()
      });
    }
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate(CART_POPULATE);

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        id: populated._id,
        items: populated.items,
        subtotal: populated.subtotal,
        itemCount: populated.itemCount,
        updatedAt: populated.updatedAt
      }
    }
  });
});

// Remove item from cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  const productId = req.params.productId || req.params.id;
  if (!productId) return next(new AppError('Product ID is required', 400));
  if (!mongoose.Types.ObjectId.isValid(productId)) return next(new AppError('Invalid product ID', 400));

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
  }

  const populated = await Cart.findById(cart._id).populate(CART_POPULATE);

  res.status(200).json({
    status: 'success',
    message: 'Item removed successfully',
    data: {
      cart: {
        id: populated._id,
        items: populated.items,
        subtotal: populated.subtotal,
        itemCount: populated.itemCount,
        updatedAt: populated.updatedAt
      }
    }
  });
});

// Update cart item quantities
exports.updateCartItems = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  const { items } = req.body;
  if (!Array.isArray(items)) return next(new AppError('Items must be an array', 400));

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  for (const update of items) {
    const itemIndex = cart.items.findIndex(
      i => (i.product?._id?.toString() || i.product?.toString()) === update.productId
    );

    if (itemIndex === -1) continue;

    if (update.quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = update.quantity;
    }
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate(CART_POPULATE);

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        id: populated._id,
        items: populated.items,
        subtotal: populated.subtotal,
        itemCount: populated.itemCount,
        updatedAt: populated.updatedAt
      }
    }
  });
});

// Clear entire cart
exports.clearCart = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({
    status: 'success',
    data: { cart: { items: [], subtotal: 0, itemCount: 0, discount: 0, total: 0 } }
  });
});

// Apply coupon
exports.applyCoupon = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  const { couponCode } = req.body;
  if (!couponCode) return next(new AppError('Coupon code is required', 400));

  const coupon = await Coupon.findOne({
    code: couponCode,
    active: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  });

  if (!coupon) return next(new AppError('Invalid or expired coupon', 400));

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return next(new AppError('Cart not found', 404));

  if (coupon.minPurchase && cart.subtotal < coupon.minPurchase) {
    return next(new AppError(`Minimum purchase of ${coupon.minPurchase} required`, 400));
  }

  cart.coupon = coupon._id;
  await cart.save();

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = cart.subtotal * (coupon.discountValue / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = Math.min(coupon.discountValue, cart.subtotal);
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
        coupon,
        updatedAt: cart.updatedAt
      }
    }
  });
});

// Remove coupon
exports.removeCoupon = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError('Authentication required', 401));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $unset: { coupon: '' } },
    { new: true }
  ).populate(CART_POPULATE);

  if (!cart) return next(new AppError('Cart not found', 404));

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
});

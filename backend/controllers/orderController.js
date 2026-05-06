// controllers/orderController.js
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const paystackService = require("../utils/paystackService");

// Get all orders for the authenticated user
exports.getOrders = catchAsync(async (req, res, next) => {
  console.log("=== GET ORDERS DEBUG ===");
  console.log("User ID:", req.user._id);
  console.log("Request URL:", req.originalUrl);

  if (!req.user || !req.user._id) {
    return next(new AppError("Authentication required", 401));
  }

  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name price image category")
    .sort({ createdAt: -1 })
    .lean();

  console.log("Found orders:", orders.length);

  // Ensure consistent data structure
  const formattedOrders = orders.map(order => ({
    ...order,
    _id: order._id.toString(),
    orderNumber: order._id.toString().slice(-8).toUpperCase(),
    items: order.items.map(item => ({
      ...item,
      product: item.product ? {
        ...item.product,
        _id: item.product._id.toString()
      } : null
    }))
  }));

  res.status(200).json({
    success: true,
    count: formattedOrders.length,
    data: {
      orders: formattedOrders
    }
  });
});

// Create a new order
exports.createOrder = catchAsync(async (req, res, next) => {
  console.log("=== ORDER CREATION DEBUG ===");
  console.log("Full req.body:", JSON.stringify(req.body, null, 2));
  console.log("User:", req.user._id);

  if (!req.user || !req.user._id) {
    return next(new AppError("Authentication required", 401));
  }

  // Extract shipping information from multiple possible locations
  let shippingInfo = {};
  
  if (req.body.customer) {
    shippingInfo = { ...shippingInfo, ...req.body.customer };
  }
  if (req.body.shippingAddress) {
    shippingInfo = { ...shippingInfo, ...req.body.shippingAddress };
  }
  
  // Extract root level fields
  const rootLevelFields = [
    'firstName', 'lastName', 'email', 'phone', 'address', 
    'city', 'state', 'zipCode', 'country', 'paymentMethod', 'mobileNumber'
  ];
  
  rootLevelFields.forEach(field => {
    if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
      shippingInfo[field] = req.body[field];
    }
  });

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    paymentMethod,
    mobileNumber,
  } = shippingInfo;

  const { items, subtotal, total, cartId } = req.body;

  console.log("Extracted shipping info:", shippingInfo);
  console.log("Items:", items);

  // Validate required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
  const missingFields = requiredFields.filter(field => {
    const value = shippingInfo[field];
    return !value || value.toString().trim() === '';
  });

  if (missingFields.length > 0) {
    return next(new AppError(`Please provide all required shipping information: ${missingFields.join(', ')}`, 400));
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError("Order must contain at least one item", 400));
  }

  // Validate and populate items with product data
  const validatedItems = [];
  for (const item of items) {
    const productId = item.product?._id || item.product || item.productId;
    
    if (!productId) {
      return next(new AppError("Each item must have a valid product ID", 400));
    }

    // Fetch product to ensure it exists and get current data
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError(`Product with ID ${productId} not found`, 404));
    }

    validatedItems.push({
      product: productId,
      quantity: item.quantity || 1,
      price: item.priceAtAddition || item.price || product.price,
      name: item.name || product.name,
      image: item.image || product.image
    });
  }

  // If cartId is provided, validate ownership
  if (cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart || cart.user.toString() !== req.user._id.toString()) {
      return next(new AppError("Invalid cart", 400));
    }
  }

  // Map payment method to match enum values
  const mapPaymentMethod = (method) => {
    const methodMap = {
      'COD': 'cod',
      'cod': 'cod',
      'momo': 'card', // Map momo to card since Paystack handles both
      'card': 'card',
      'credit_card': 'card'
    };
    return methodMap[method] || 'cod';
  };

  const mappedPaymentMethod = mapPaymentMethod(paymentMethod);

  // Calculate totals
  const calculatedSubtotal = validatedItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  // Build order document
  const orderData = {
    user: req.user._id,
    items: validatedItems,
    shippingAddress: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: (mobileNumber || phone).toString().trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.toString().trim(),
      country: country.trim(),
    },
    paymentMethod: mappedPaymentMethod,
    mobileNumber: (mobileNumber || phone).toString().trim(),
    subtotal: subtotal || calculatedSubtotal,
    total: total || subtotal || calculatedSubtotal,
  };

  console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

  const order = await Order.create(orderData);

  // If Paystack payment (card or mobile money), initiate payment process
  if (mappedPaymentMethod === 'card') {
    try {
      // Generate unique reference for Paystack
      const paystackReference = paystackService.generateReference();
      
      const paymentResponse = await paystackService.initializeTransaction({
        email: email.trim().toLowerCase(),
        amount: order.total,
        reference: paystackReference,
        callback_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-confirm/${order._id}`,
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: order._id.toString()
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${firstName} ${lastName}`
            }
          ]
        }
      });

      // Update order with payment reference
      order.paystackDetails = {
        reference: paystackReference,
        accessCode: paymentResponse.access_code,
        paymentStatus: 'pending'
      };
      await order.save();

      console.log("Paystack payment initialized:", paymentResponse);

      // Clear user cart if cartId was provided
      if (cartId) {
        await Cart.findByIdAndUpdate(cartId, {
          items: [],
          subtotal: 0,
          itemCount: 0,
        });
      }

      // Populate the created order
      const populatedOrder = await Order.findById(order._id)
        .populate("items.product", "name price image category")
        .lean();

      console.log("Order created successfully with Paystack payment:", populatedOrder._id);

      return res.status(201).json({
        success: true,
        data: { 
          order: {
            ...populatedOrder,
            orderNumber: populatedOrder._id.toString().slice(-8).toUpperCase()
          }
        },
        paymentRequired: true,
        paymentUrl: paymentResponse.authorization_url,
        reference: paystackReference,
        message: "Order created. Redirect to payment page."
      });
    } catch (paymentError) {
      console.error("Paystack payment initiation failed:", paymentError);
      
      // Update order status to reflect payment failure
      order.paystackDetails = {
        paymentStatus: 'failed'
      };
      await order.save();

      return next(new AppError('Order created but payment initiation failed. Please try again or choose cash on delivery.', 400));
    }
  }

  // Clear user cart if cartId was provided (for cash on delivery payments)
  if (cartId) {
    await Cart.findByIdAndUpdate(cartId, {
      items: [],
      subtotal: 0,
      itemCount: 0,
    });
  }

  // Populate the created order
  const populatedOrder = await Order.findById(order._id)
    .populate("items.product", "name price image category")
    .lean();

  console.log("Order created successfully:", populatedOrder._id);

  res.status(201).json({
    success: true,
    data: { 
      order: {
        ...populatedOrder,
        orderNumber: populatedOrder._id.toString().slice(-8).toUpperCase()
      }
    },
    message: "Order placed successfully"
  });
});

// Get a specific order by ID
exports.getOrderById = catchAsync(async (req, res, next) => {
  console.log("=== GET ORDER BY ID ===");
  console.log("Order ID:", req.params.id);
  console.log("User ID:", req.user._id);

  const order = await Order.findById(req.params.id)
    .populate("items.product", "name price image category")
    .populate("user", "firstName lastName email")
    .lean();

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if the order belongs to the authenticated user
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("Not authorized to access this order", 403));
  }

  res.status(200).json({
    success: true,
    data: {
      order: {
        ...order,
        orderNumber: order._id.toString().slice(-8).toUpperCase()
      }
    }
  });
});

// Update order status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  console.log("=== UPDATE ORDER STATUS ===");
  console.log("Order ID:", req.params.id);
  console.log("New Status:", req.body.status);
  console.log("User:", req.user._id, "Role:", req.user.role);

  const { status } = req.body;
  const validStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if the order belongs to the authenticated user or user is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("Not authorized to update this order", 403));
  }

  // Prevent cancelling orders that are already completed, delivered, or shipped
  if (status === "cancelled") {
    if (["completed", 'delivered', "shipped"].includes(order.status)) {
      return next(new AppError(`Cannot cancel an order that is already ${order.status}`, 400));
    }
    
    // Also check if order is already cancelled
    if (order.status === "cancelled") {
      return next(new AppError("Order is already cancelled", 400));
    }
  }

  // Update the status
  order.status = status;
  
  // Set additional fields based on status
  if (status === "paid" && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
  }
  
  if (status === "completed" && !order.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();

  console.log("Order status updated successfully");

  // Populate the updated order
  const populatedOrder = await Order.findById(order._id)
    .populate("items.product", "name price image category")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      order: {
        ...populatedOrder,
        orderNumber: order._id.toString().slice(-8).toUpperCase()
      }
    },
    message: `Order status updated to ${status}`
  });
});

// Check payment status
exports.checkPaymentStatus = catchAsync(async (req, res, next) => {
  console.log("=== CHECK PAYMENT STATUS ===");
  console.log("Order ID:", req.params.id);

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if the order belongs to the authenticated user
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("Not authorized to access this order", 403));
  }

  // If it's a Paystack payment and has a reference, check with payment provider
  if (order.paymentMethod === 'card' && order.paystackDetails && order.paystackDetails.reference) {
    try {
      const paymentStatus = await paystackService.verifyTransaction(order.paystackDetails.reference);
      
      // Update order status based on payment status
      if (paymentStatus.status === 'success' && order.paystackDetails.paymentStatus !== 'success') {
        order.paystackDetails.paymentStatus = 'success';
        order.isPaid = true;
        order.paidAt = new Date(paymentStatus.paid_at || new Date());
        order.status = 'paid';
        await order.save();
      } else if (paymentStatus.status === 'failed' && order.paystackDetails.paymentStatus !== 'failed') {
        order.paystackDetails.paymentStatus = 'failed';
        await order.save();
      }

      return res.status(200).json({
        success: true,
        data: {
          paymentStatus: order.paystackDetails.paymentStatus,
          reference: order.paystackDetails.reference,
          orderStatus: order.status,
          paidAt: order.paidAt
        }
      });
    } catch (error) {
      console.error("Error checking payment status:", error);
      // Continue to return current status even if external check fails
    }
  }

  res.status(200).json({
    success: true,
    data: {
      paymentStatus: order.paymentMethod === 'card' && order.paystackDetails 
        ? order.paystackDetails.paymentStatus 
        : (order.isPaid ? 'paid' : 'pending'),
      orderStatus: order.status
    }
  });
});

// Get order statistics (bonus endpoint)
exports.getOrderStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  
  const stats = await Order.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$total" }
      }
    }
  ]);

  const totalOrders = await Order.countDocuments({ user: userId });
  const totalSpent = await Order.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      statusBreakdown: stats
    }
  });
});
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");

// ── email helper (fire-and-forget — never blocks the response) ──────────────
function sendOrderNotification(order, shipping) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return; // skip silently if not configured

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const itemsHtml = (order.items || [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${i.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="background:#16a34a;color:#fff;padding:16px 24px;margin:0">
        🛒 New Order Received — #${order._id.toString().slice(-8).toUpperCase()}
      </h2>
      <div style="padding:24px;background:#f9fafb">
        <h3 style="margin-top:0">Customer Details</h3>
        <p><strong>Name:</strong> ${shipping.firstName} ${shipping.lastName}</p>
        <p><strong>Phone:</strong> ${shipping.phone}</p>
        <p><strong>Email:</strong> ${shipping.email}</p>
        <p><strong>Address:</strong> ${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}, ${shipping.country}</p>

        <h3>Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse;background:#fff">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px 12px;text-align:left">Product</th>
              <th style="padding:8px 12px;text-align:center">Qty</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <p style="margin-top:16px;background:#fef3c7;padding:12px;border-radius:6px">
          <strong>Payment:</strong> Payment on Delivery — confirm price when calling customer.
        </p>
        <p style="color:#6b7280;font-size:13px">
          Order placed: ${new Date(order.createdAt).toLocaleString("en-GH", { timeZone: "Africa/Accra" })}
        </p>
      </div>
    </div>`;

  transporter
    .sendMail({
      from: `"Nashma Orders" <${user}>`,
      to: process.env.NOTIFY_EMAIL || "nashmafarms@gmail.com",
      subject: `New Order #${order._id.toString().slice(-8).toUpperCase()} — ${shipping.firstName} ${shipping.lastName}`,
      html,
    })
    .catch((err) => console.error("Order notification email failed:", err.message));
}

// GET /api/orders — all orders for authenticated user
exports.getOrders = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError("Authentication required", 401));

  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name price image category")
    .sort({ createdAt: -1 })
    .lean();

  const formatted = orders.map((o) => ({
    ...o,
    _id: o._id.toString(),
    orderNumber: o._id.toString().slice(-8).toUpperCase(),
    items: o.items.map((item) => ({
      ...item,
      product: item.product ? { ...item.product, _id: item.product._id.toString() } : null,
    })),
  }));

  if (res.headersSent) return;
  res.status(200).json({ success: true, count: formatted.length, data: { orders: formatted } });
});

// POST /api/orders — create new COD order
exports.createOrder = catchAsync(async (req, res, next) => {
  if (!req.user?._id) return next(new AppError("Authentication required", 401));

  // Merge shipping from multiple possible payload shapes
  const shipping = {
    ...req.body.customer,
    ...req.body.shippingAddress,
  };
  ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode", "country", "mobileNumber"].forEach(
    (f) => { if (req.body[f]) shipping[f] = req.body[f]; }
  );

  const { firstName, lastName, email, phone, mobileNumber, address, city, state, zipCode, country } = shipping;
  const { items, subtotal, total, cartId } = req.body;

  const missing = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode", "country"].filter(
    (f) => !shipping[f]?.toString().trim()
  );
  if (missing.length) return next(new AppError(`Missing required fields: ${missing.join(", ")}`, 400));
  if (!items?.length) return next(new AppError("Order must contain at least one item", 400));

  // Batch-fetch all products in one query (avoids N round-trips)
  const productIds = items.map((item) => item.product?._id || item.product || item.productId).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const validatedItems = [];
  for (const item of items) {
    const productId = (item.product?._id || item.product || item.productId)?.toString();
    if (!productId) return next(new AppError("Each item must have a valid product ID", 400));
    const product = productMap.get(productId);
    if (!product) return next(new AppError(`Product ${productId} not found`, 404));
    validatedItems.push({
      product: productId,
      quantity: item.quantity || 1,
      price: item.priceAtAddition ?? item.price ?? product.price ?? 0,
      name: item.name || product.name,
      image: item.image || product.image || "",
    });
  }

  if (cartId) {
    const cart = await Cart.findById(cartId).lean();
    if (!cart || cart.user.toString() !== req.user._id.toString())
      return next(new AppError("Invalid cart", 400));
  }

  const calculatedSubtotal = validatedItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const order = await Order.create({
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
    paymentMethod: "cod",
    mobileNumber: (mobileNumber || phone).toString().trim(),
    subtotal: subtotal ?? calculatedSubtotal,
    total: total ?? subtotal ?? calculatedSubtotal,
  });

  // Clear cart (parallel, non-blocking)
  if (cartId) {
    Cart.findByIdAndUpdate(cartId, { items: [], subtotal: 0, itemCount: 0 }).catch(() => {});
  }

  // Send email notification (fire and forget — never blocks response)
  sendOrderNotification(order, order.shippingAddress);

  const populated = await Order.findById(order._id)
    .populate("items.product", "name price image category")
    .lean();

  if (res.headersSent) return;
  res.status(201).json({
    success: true,
    data: { order: { ...populated, orderNumber: populated._id.toString().slice(-8).toUpperCase() } },
    message: "Order placed successfully",
  });
});

// GET /api/orders/:id
exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product", "name price image category")
    .populate("user", "firstName lastName email")
    .lean();

  if (!order) return next(new AppError("Order not found", 404));
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
    return next(new AppError("Not authorized", 403));

  if (res.headersSent) return;
  res.status(200).json({
    success: true,
    data: { order: { ...order, orderNumber: order._id.toString().slice(-8).toUpperCase() } },
  });
});

// PATCH /api/orders/:id/status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const valid = ["pending", "confirmed", "shipped", "completed", "cancelled"];
  if (!valid.includes(status))
    return next(new AppError(`Status must be one of: ${valid.join(", ")}`, 400));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
    return next(new AppError("Not authorized", 403));

  if (status === "cancelled" && ["completed", "shipped"].includes(order.status))
    return next(new AppError(`Cannot cancel an order that is already ${order.status}`, 400));

  order.status = status;
  if (status === "completed" && !order.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  await order.save();

  const populated = await Order.findById(order._id)
    .populate("items.product", "name price image category")
    .lean();

  if (res.headersSent) return;
  res.status(200).json({
    success: true,
    data: { order: { ...populated, orderNumber: order._id.toString().slice(-8).toUpperCase() } },
    message: `Order status updated to ${status}`,
  });
});

// GET /api/admin/orders — all orders (admin only)
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 })
    .lean();

  const formatted = orders.map(o => ({
    ...o,
    _id: o._id.toString(),
    orderNumber: o._id.toString().slice(-8).toUpperCase(),
  }));

  res.status(200).json({ success: true, count: formatted.length, data: { orders: formatted } });
});

// GET order stats (admin)
exports.getOrderStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const [stats, totalOrders, totalSpentResult] = await Promise.all([
    Order.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ user: userId }),
    Order.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
  ]);

  if (res.headersSent) return;
  res.status(200).json({
    success: true,
    data: { totalOrders, totalSpent: totalSpentResult[0]?.total || 0, statusBreakdown: stats },
  });
});

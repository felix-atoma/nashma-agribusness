const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes (require authentication)
router.use(authController.protect);

// GET /api/cart - Get user's cart
// POST /api/cart - Add item to cart
// DELETE /api/cart/clear - Clear entire cart (moved to avoid conflicts)
router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addToCart);

// PATCH /api/cart/items - Update multiple cart items
router
  .route('/items')
  .patch(cartController.updateCartItems);

// DELETE /api/cart/items/:productId - Remove specific item from cart
router
  .route('/items/:productId')
  .delete(cartController.removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router
  .route('/clear')
  .delete(cartController.clearCart);

// POST /api/cart/coupon - Apply coupon to cart
// DELETE /api/cart/coupon - Remove coupon from cart
router
  .route('/coupon')
  .post(cartController.applyCoupon)
  .delete(cartController.removeCoupon);

module.exports = router;
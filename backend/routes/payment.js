// routes/payment.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const paystackService = require('../services/paystackService');
const { protect } = require('../middleware/authMiddleware');

// Verify payment status (protected route)
// routes/payment.js - Updated verification endpoint
router.get('/verify/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params;
    
    console.log('Payment verification request for reference:', reference);
    console.log('Authenticated user ID:', req.user._id);

    // Find order by reference with better debugging
    const order = await Order.findOne({ 
      'paystackDetails.reference': reference 
    }).populate('user', 'firstName lastName email');

    console.log('Order search result:', order ? 'Found' : 'Not found');
    
    if (!order) {
      // Log all orders with paystack references for debugging
      const ordersWithReferences = await Order.find({
        'paystackDetails.reference': { $exists: true }
      }, 'paystackDetails.reference user');
      
      console.log('Orders with payment references:', ordersWithReferences.map(o => ({
        reference: o.paystackDetails?.reference,
        userId: o.user?.toString()
      })));
      
      return res.status(404).json({
        success: false,
        message: 'Order not found for this payment reference'
      });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user._id.toString()) {
      console.log('User unauthorized. Order user:', order.user._id, 'Request user:', req.user._id);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify this payment'
      });
    }

    console.log('Order found:', order._id, 'Payment status:', order.paystackDetails.paymentStatus);

    // Verify with Paystack (for real payments)
    let paymentStatus;
    if (process.env.USE_MOCK_PAYMENTS === 'true') {
      // For mock payments, simulate success
      paymentStatus = {
        status: 'success',
        reference: reference,
        paid_at: new Date().toISOString()
      };
      console.log('Using mock payment verification');
    } else {
      // For real payments, verify with Paystack
      paymentStatus = await paystackService.verifyTransaction(reference);
      console.log('Real payment verification result:', paymentStatus.status);
    }

    // Update order status based on payment
    if (paymentStatus.status === 'success' && order.paystackDetails.paymentStatus !== 'success') {
      order.paystackDetails.paymentStatus = 'success';
      order.isPaid = true;
      order.paidAt = new Date(paymentStatus.paid_at || new Date());
      order.status = 'paid';
      await order.save();
      
      console.log('Order updated successfully. New status:', order.status);
    }

    res.json({
      success: true,
      data: {
        order: order,
        paymentStatus: order.paystackDetails.paymentStatus
      }
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
});

// Webhook endpoint (no authentication required)
router.post('/webhook/paystack', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Webhook implementation here
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

module.exports = router;
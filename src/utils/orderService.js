// services/orderService.js
import apiClient from './apiClient';

export const verifyPayment = async (reference) => {
  try {
    console.log('Verifying payment for reference:', reference);
    
    const response = await apiClient.verifyPayment(reference);
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error(response.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Handle specific error cases
    if (error.status === 404) {
      throw new Error('Payment reference not found. Please contact support with reference: ' + reference);
    } else if (error.status === 401) {
      throw new Error('Please log in to verify your payment');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(error.message || 'Failed to verify payment');
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await apiClient.getOrderById(orderId);
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error(response.message || 'Failed to fetch order');
    }
  } catch (error) {
    console.error('Get order error:', error);
    throw new Error(error.message || 'Failed to fetch order');
  }
};

export const getUserOrders = async () => {
  try {
    const response = await apiClient.getOrders();
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error(response.message || 'Failed to fetch orders');
    }
  } catch (error) {
    console.error('Get user orders error:', error);
    throw new Error(error.message || 'Failed to fetch orders');
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.createOrder(orderData);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        paymentRequired: response.paymentRequired || false,
        paymentUrl: response.paymentUrl || null,
        reference: response.reference || null
      };
    } else {
      throw new Error(response.message || 'Failed to create order');
    }
  } catch (error) {
    console.error('Create order error:', error);
    throw new Error(error.message || 'Failed to create order');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.updateOrderStatus(orderId, status);
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      throw new Error(response.message || 'Failed to update order status');
    }
  } catch (error) {
    console.error('Update order status error:', error);
    throw new Error(error.message || 'Failed to update order status');
  }
};

export default {
  verifyPayment,
  getOrder,
  getUserOrders,
  createOrder,
  updateOrderStatus
};
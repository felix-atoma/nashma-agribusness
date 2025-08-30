// context/OrderContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import apiClient from "../utils/apiClient";
import { toast } from 'react-toastify';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated, initialized } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchUserOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching orders from API...');
      const response = await apiClient.getOrders();
      
      console.log('Orders API response:', response);
      
      if (response.success) {
        let ordersData = [];
        
        // Handle the specific response structure: {data: {orders: []}}
        if (response.data && response.data.orders && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } 
        // Handle other possible structures
        else if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        }
        
        console.log('Processed orders data:', ordersData);
        setOrders(ordersData);
        
        // Show toast message if no orders found
        if (ordersData.length === 0) {
          toast.info('No orders found. Start shopping to place your first order!', {
            autoClose: 3000,
            position: 'bottom-right'
          });
        } else {
          toast.success(`Loaded ${ordersData.length} order(s) successfully!`, {
            autoClose: 2000,
            position: 'bottom-right'
          });
        }
        
        return ordersData;
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch orders";
      setError(errorMsg);
      
      // Show error toast
      toast.error('Failed to load orders. Please try again.', {
        autoClose: 3000,
        position: 'bottom-right'
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialized && isAuthenticated && user) {
      console.log('OrderContext: Fetching orders for user:', user._id);
      fetchUserOrders();
    } else {
      console.log('OrderContext: Clearing orders - not authenticated');
      setOrders([]);
      setError(null);
    }
  }, [initialized, isAuthenticated, user]);

  const placeOrder = async (orderData) => {
    setError(null);

    if (!initialized || !isAuthenticated || !user) {
      toast.error('Please log in to place an order');
      throw new Error("Authentication required");
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      throw new Error("Cart is empty");
    }

    if (!orderData.shippingAddress) {
      toast.error('Please provide shipping information');
      throw new Error("Shipping address is required");
    }

    setLoading(true);

    try {
      const formattedOrderData = {
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        email: orderData.shippingAddress.email,
        phone: orderData.shippingAddress.phone,
        address: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        zipCode: orderData.shippingAddress.zipCode,
        country: orderData.shippingAddress.country,
        paymentMethod: orderData.paymentMethod,
        mobileNumber: orderData.shippingAddress.phone,
        items: orderData.items,
        subtotal: orderData.subtotal,
        total: orderData.totalPrice,
        cartId: cart?._id || null,
        userId: user._id || user.id
      };

      // Show loading toast
      const loadingToast = toast.loading('Placing your order...', {
        position: 'bottom-right'
      });

      const response = await apiClient.createOrder(formattedOrderData);
      
      if (!response.success) {
        throw new Error(response.message || response.data?.message || "Failed to place order");
      }

      const newOrder = response.data.order || response.data;
      
      // Add the new order to the beginning of the list
      setOrders(prev => [newOrder, ...prev]);

      if (clearCart) {
        clearCart();
      }

      // Update toast to success
      toast.update(loadingToast, {
        render: 'Order placed successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: 'bottom-right'
      });

      return newOrder;

    } catch (error) {
      console.error('Order placement failed:', error);
      let errorMsg = error.message || "An unexpected error occurred";
      
      if (error.response) {
        errorMsg = error.response.data?.message || error.response.data?.error || errorMsg;
      }
      
      setError(errorMsg);
      
      // Show error toast
      toast.error(`Order failed: ${errorMsg}`, {
        autoClose: 4000,
        position: 'bottom-right'
      });
      
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId);
  };

  const getUserOrders = () => {
    return orders;
  };

  const clearError = () => {
    setError(null);
  };

  const refreshOrders = async () => {
    return fetchUserOrders();
  };

  const value = {
    orders,
    placeOrder,
    loading,
    error,
    getOrderById,
    getUserOrders,
    clearError,
    refreshOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
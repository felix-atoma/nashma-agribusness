import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import toast from '../utils/toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const defaultCart = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  total: 0,
  discount: 0,
  coupon: null,
};

// Helper function to calculate cart totals
const calculateCartTotals = (cartData) => {
  if (!cartData || !cartData.items) {
    return defaultCart;
  }

  const items = Array.isArray(cartData.items) ? cartData.items : [];
  
  // Calculate itemCount (total quantity of all items)
  const itemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);

  // Calculate total (after discount)
  const discount = cartData.discount || 0;
  const total = subtotal - discount;

  return {
    ...cartData,
    items,
    itemCount,
    subtotal,
    total,
    discount,
    coupon: cartData.coupon || null,
  };
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(defaultCart);
  const [isLoading, setIsLoading] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(defaultCart);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.getCart();
      console.log('Fetched cart response:', response);
      
      const cartData = response?.data?.cart || response?.data || defaultCart;
      const calculatedCart = calculateCartTotals(cartData);
      
      console.log('Calculated cart:', calculatedCart);
      setCart(calculatedCart);
    } catch (error) {
      toast.error('Failed to fetch cart');
      console.error('Cart fetch error:', error);
      setCart(defaultCart);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Wrap addToCart in useCallback to prevent infinite loops
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    if (operationInProgress === 'addToCart') return false;
    
    setOperationInProgress('addToCart');
    try {
      console.log('Adding to cart:', { productId, quantity });
      const response = await apiClient.addToCart(productId, quantity);
      console.log('Add to cart response:', response);
      
      const cartData = response?.data?.cart || response?.data || defaultCart;
      const calculatedCart = calculateCartTotals(cartData);
      
      console.log('Updated cart after add:', calculatedCart);
      setCart(calculatedCart);
      toast.success('Item added to cart!');
      return true;
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add item to cart');
      return false;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user || operationInProgress === 'removeFromCart') return false;

    setOperationInProgress('removeFromCart');
    try {
      await apiClient.removeFromCart(productId);
      await fetchCart(); // Refetch to get updated cart
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error('Remove from cart error:', error);
      return false;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress, fetchCart]);

  const updateCartItems = useCallback(async (items) => {
    if (!user || operationInProgress === 'updateCart') return false;

    setOperationInProgress('updateCart');
    try {
      const response = await apiClient.updateCartItems(items);
      const cartData = response?.data?.cart || response?.data || defaultCart;
      const calculatedCart = calculateCartTotals(cartData);
      
      setCart(calculatedCart);
      toast.success('Cart updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
      console.error('Update cart error:', error);
      return false;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress]);

  const clearCart = useCallback(async () => {
    if (!user || operationInProgress === 'clearCart') return false;

    setOperationInProgress('clearCart');
    try {
      await apiClient.clearCart();
      setCart(defaultCart);
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Clear cart error:', error);
      return false;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress]);

  const applyCoupon = useCallback(async (code) => {
    if (!user || operationInProgress === 'applyCoupon') return false;

    setOperationInProgress('applyCoupon');
    try {
      const response = await apiClient.applyCoupon(code);
      const cartData = response?.data?.cart || response?.data || defaultCart;
      const calculatedCart = calculateCartTotals(cartData);
      
      setCart(calculatedCart);
      toast.success('Coupon applied successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to apply coupon');
      console.error('Apply coupon error:', error);
      throw error;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress]);

  const removeCoupon = useCallback(async () => {
    if (!user || operationInProgress === 'removeCoupon') return false;

    setOperationInProgress('removeCoupon');
    try {
      const response = await apiClient.removeCoupon();
      const cartData = response?.data?.cart || response?.data || defaultCart;
      const calculatedCart = calculateCartTotals(cartData);
      
      setCart(calculatedCart);
      toast.success('Coupon removed');
      return true;
    } catch (error) {
      toast.error('Failed to remove coupon');
      console.error('Remove coupon error:', error);
      return false;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress]);

  const value = {
    cart,
    loading: isLoading,
    isLoading,
    isUpdating: operationInProgress !== null,
    addToCart,
    removeFromCart,
    updateCartItems,
    applyCoupon,
    removeCoupon,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
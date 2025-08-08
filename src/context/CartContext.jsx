import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../utils/apiClient'
import toast from '../utils/toast';
import { useAuth } from './AuthContext';
import apiClient from '../utils/apiClient';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    itemCount: 0,
    total: 0,
    discount: 0,
    coupon: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({
        items: [],
        subtotal: 0,
        itemCount: 0,
        total: 0,
        discount: 0,
        coupon: null,
      });
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiClient.getCart();
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Failed to fetch cart');
      console.error('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.addToCart(productId, quantity);
      setCart(response.data.cart);
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    setLoading(true);
    try {
      await apiService.removeFromCart(productId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItems = async (items) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiClient.updateCartItems(items);
      setCart(response.data.cart);
      toast.success('Cart updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await apiService.clearCart();
      setCart({
        items: [],
        subtotal: 0,
        itemCount: 0,
        total: 0,
        discount: 0,
        coupon: null,
      });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiClient.applyCoupon(code);
      setCart(response.data.cart);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to apply coupon');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiClient.removeCoupon();
      setCart(response.data.cart);
      toast.success('Coupon removed');
    } catch (error) {
      toast.error('Failed to remove coupon');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
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
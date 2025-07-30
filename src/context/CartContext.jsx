import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch cart data from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/cart');
      
      setCartItems(response.data.items || []);
      setSubtotal(response.data.subtotal || 0);
      setItemCount(response.data.itemCount || 0);
      setHasInitialized(true);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      
      // Only show toast for non-auth errors and only once
      if (error.status !== 401 && !hasInitialized) {
        toast.error('Failed to load cart');
      }
      
      // Set default values for unauthenticated users
      if (error.status === 401) {
        setCartItems([]);
        setSubtotal(0);
        setItemCount(0);
      }
      
      setHasInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log('🛒 Adding to cart:', { productId, quantity });
      
      const response = await apiClient.post('/api/cart', {
        productId: productId,
        quantity: Math.max(1, Math.round(Number(quantity)))
      });

      console.log('✅ Cart updated:', response);
      
      // Update local state with backend response
      setCartItems(response.data.items || []);
      setSubtotal(response.data.subtotal || 0);
      setItemCount(response.data.itemCount || 0);
      
      toast.success('Item added to cart');
      return { success: true };
    } catch (error) {
      console.error('❌ Add to cart failed:', error);
      
      let errorMessage = 'Failed to add item to cart';
      
      if (error.status === 400) {
        errorMessage = error.data?.message || 'Invalid product or quantity';
      } else if (error.status === 404) {
        errorMessage = 'Product not available or out of stock';
      } else if (error.status === 401) {
        errorMessage = 'Please login to add items to cart';
        throw new Error('Authentication required');
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await apiClient.delete(`/api/cart/${productId}`);
      
      setCartItems(response.data.items || []);
      setSubtotal(response.data.subtotal || 0);
      setItemCount(response.data.itemCount || 0);
      
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
      return { success: false };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const qty = Math.max(0, Math.min(100, Math.round(Number(quantity))));
      
      const response = await apiClient.patch('/api/cart', {
        items: [{ productId, quantity: qty }]
      });
      
      setCartItems(response.data.items || []);
      setSubtotal(response.data.subtotal || 0);
      setItemCount(response.data.itemCount || 0);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
      return { success: false };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await apiClient.delete('/api/cart');
      
      setCartItems([]);
      setSubtotal(0);
      setItemCount(0);
      
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
      return { success: false };
    }
  };

  // Bulk update cart items
  const updateCart = async (items) => {
    try {
      const response = await apiClient.patch('/api/cart', { items });
      
      setCartItems(response.data.items || []);
      setSubtotal(response.data.subtotal || 0);
      setItemCount(response.data.itemCount || 0);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart');
      return { success: false };
    }
  };

  // Get item quantity for a specific product
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => 
      item.product._id === productId || item.product === productId
    );
    return item ? item.quantity : 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => 
      item.product._id === productId || item.product === productId
    );
  };

  // Load cart on mount (for authenticated users) - only once
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !hasInitialized) {
      fetchCart();
    } else if (!token) {
      // Set empty cart for non-authenticated users
      setCartItems([]);
      setSubtotal(0);
      setItemCount(0);
      setHasInitialized(true);
    }
  }, [hasInitialized]); // Only depend on hasInitialized

  const value = {
    cartItems,
    subtotal,
    itemCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateCart,
    fetchCart,
    getItemQuantity,
    isInCart,
    hasInitialized
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
// context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  if (!cartData) {
    return defaultCart;
  }

  let items = [];
  
  if (Array.isArray(cartData.items) && cartData.items.length > 0) {
    items = cartData.items;
  } else if (Array.isArray(cartData) && cartData.length > 0) {
    items = cartData;
  } else {
    items = [];
  }

  const itemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  const subtotal = items.reduce((total, item) => {
    const price = item.product?.price || item.price || item.priceAtAddition || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);

  const discount = cartData.discount || 0;
  const total = Math.max(0, subtotal - discount);

  return {
    id: cartData.id,
    items,
    itemCount,
    subtotal: parseFloat(subtotal.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    discount,
    coupon: cartData.coupon || null,
  };
};

// Helper to create optimistic cart updates
const createOptimisticUpdate = (currentCart, updateFn) => {
  try {
    return calculateCartTotals(updateFn(currentCart));
  } catch (error) {
    console.error('Error creating optimistic update:', error);
    return currentCart;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(defaultCart);
  const [isLoading, setIsLoading] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(null);
  const operationTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Cleanup operation timeout
  const clearOperationTimeout = useCallback(() => {
    if (operationTimeoutRef.current) {
      clearTimeout(operationTimeoutRef.current);
      operationTimeoutRef.current = null;
    }
  }, []);

  // Set operation with timeout to prevent stuck states
  const setOperationWithTimeout = useCallback((operation) => {
    clearOperationTimeout();
    setOperationInProgress(operation);
    
    // Clear operation after 10 seconds to prevent stuck states
    operationTimeoutRef.current = setTimeout(() => {
      console.warn(`Operation ${operation} timed out, clearing...`);
      setOperationInProgress(null);
    }, 10000);
  }, [clearOperationTimeout]);

  // Clear operation and timeout
  const clearOperation = useCallback(() => {
    clearOperationTimeout();
    setOperationInProgress(null);
  }, [clearOperationTimeout]);

  // Optimized cart update function
  const updateCartState = useCallback((newCartData) => {
    const calculatedCart = calculateCartTotals(newCartData);
    setCart(prevCart => {
      // Only update if there's actually a change
      if (JSON.stringify(prevCart) !== JSON.stringify(calculatedCart)) {
        return calculatedCart;
      }
      return prevCart;
    });
    return calculatedCart;
  }, []);

  // Fetch cart with retry logic
  const fetchCartWithRetry = useCallback(async (retryCount = 0) => {
    if (!user) {
      setCart(defaultCart);
      return defaultCart;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.getCart();
      
      // Extract cart data from response
      let cartData;
      if (response?.data?.cart) {
        cartData = response.data.cart;
      } else if (response?.data?.data) {
        cartData = response.data.data;
      } else if (response?.data && response.data.items) {
        cartData = response.data;
      } else {
        cartData = defaultCart;
      }
      
      const calculatedCart = updateCartState(cartData);
      
      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Cart fetched successfully:', calculatedCart);
      }
      
      return calculatedCart;
    } catch (error) {
      // Retry once if request was cancelled
      if (error.message === 'Request was cancelled' && retryCount === 0) {
        setTimeout(() => fetchCartWithRetry(1), 100);
        return;
      }
      
      // Don't show error toast for cancelled requests or 404s
      if (error.message !== 'Request was cancelled' && error.status !== 404) {
        toast.error('Failed to fetch cart');
      }
      
      // Only set default cart if it's not a cancelled request
      if (error.message !== 'Request was cancelled') {
        setCart(defaultCart);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, updateCartState]);

  const fetchCart = useCallback(() => fetchCartWithRetry(0), [fetchCartWithRetry]);

  // Initialize cart when user changes
  useEffect(() => {
    if (user && !isInitializedRef.current) {
      fetchCart().catch(console.error);
      isInitializedRef.current = true;
    } else if (!user) {
      setCart(defaultCart);
      isInitializedRef.current = false;
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(
    async (productOrItems, quantity = 1) => {
      if (!user) {
        toast.error("Please login to add items to cart");
        return false;
      }

      if (operationInProgress) {
        return false;
      }

      setOperationWithTimeout("addToCart");

      // Store original cart for rollback
      const originalCart = { ...cart };

      try {
        // Case 1: Bulk add (array of items)
        if (Array.isArray(productOrItems)) {
          await apiClient.addManyToCart(productOrItems);
          await fetchCart();
          toast.success("Items added to cart!");
          return true;
        }

        // Case 2: Single product - Create optimistic update
        let productId;
        let productObj;

        if (typeof productOrItems === "string") {
          productId = productOrItems;
          productObj = { _id: productId };
        } else if (productOrItems && productOrItems._id) {
          productId = productOrItems._id;
          productObj = productOrItems;
        } else {
          toast.error("Invalid product");
          return false;
        }

        // Optimistic update
        const optimisticCart = createOptimisticUpdate(cart, (currentCart) => {
          const existingItemIndex = currentCart.items.findIndex(item => 
            (item.product?._id || item.productId) === productId
          );
          
          const newItems = [...currentCart.items];
          if (existingItemIndex >= 0) {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity
            };
          } else {
            newItems.push({
              productId,
              product: productObj,
              quantity,
              price: productObj.price || 0
            });
          }
          
          return { ...currentCart, items: newItems };
        });

        setCart(optimisticCart);

        // API call
        await apiClient.addToCart(productId, quantity);
        
        // Fetch fresh data to ensure sync
        await fetchCart();
        
        toast.success("Item added to cart!");
        return true;
      } catch (error) {
        // Rollback on error
        setCart(originalCart);
        console.error("Add to cart error:", error);
        toast.error(error.message || "Failed to add item(s) to cart");
        return false;
      } finally {
        clearOperation();
      }
    },
    [user, operationInProgress, cart, fetchCart, setOperationWithTimeout, clearOperation]
  );

  const removeFromCart = useCallback(
    async (product) => {
      if (!user || operationInProgress) return false;

      // Normalize productId
      let productId;
      if (typeof product === "string") {
        productId = product;
      } else if (product && (product._id || product.id)) {
        productId = product._id || product.id;
      } else {
        toast.error("Invalid product");
        return false;
      }

      setOperationWithTimeout(`removeFromCart-${productId}`);
      
      // Store original cart for rollback
      const originalCart = { ...cart };

      try {
        // Optimistic update - remove item immediately
        const optimisticCart = createOptimisticUpdate(cart, (currentCart) => ({
          ...currentCart,
          items: currentCart.items.filter(item => {
            const itemId = item.product?._id || item.productId;
            return itemId !== productId;
          })
        }));

        setCart(optimisticCart);

        // API call
        await apiClient.removeFromCart(productId);
        
        // Fetch fresh data to ensure sync
        await fetchCart();
        
        toast.success("Item removed from cart");
        return true;
      } catch (error) {
        // Rollback on error
        setCart(originalCart);
        console.error("Remove from cart error:", error);
        
        // Handle specific error cases
        if (error.status !== 404) {
          toast.error(error.message || "Failed to remove item from cart");
        } else {
          // Item was already removed, keep the optimistic update
          await fetchCart();
          toast.success("Item removed from cart");
          return true;
        }
        return false;
      } finally {
        clearOperation();
      }
    },
    [user, operationInProgress, cart, fetchCart, setOperationWithTimeout, clearOperation]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (!user || operationInProgress) return false;

      setOperationWithTimeout(`updateQuantity-${productId}`);
      
      // Store original cart for rollback
      const originalCart = { ...cart };

      try {
        if (quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          return await removeFromCart(productId);
        }

        // Optimistic update
        const optimisticCart = createOptimisticUpdate(cart, (currentCart) => ({
          ...currentCart,
          items: currentCart.items.map(item => {
            const itemId = item.product?._id || item.productId;
            return itemId === productId
              ? { ...item, quantity }
              : item;
          })
        }));

        setCart(optimisticCart);

        // API call
        await apiClient.updateCartItem(productId, quantity);
        
        // Fetch fresh data to ensure sync
        await fetchCart();
        
        return true;
      } catch (error) {
        // Rollback on error
        setCart(originalCart);
        console.error('Update cart item error:', error);
        
        // Handle specific error cases
        if (error.status === 404) {
          // Item not found in cart, sync with server
          await fetchCart();
          toast.info('Item was already removed from cart');
          return true;
        }
        
        toast.error(error.message || 'Failed to update cart item');
        return false;
      } finally {
        clearOperation();
      }
    },
    [user, operationInProgress, cart, fetchCart, setOperationWithTimeout, clearOperation, removeFromCart]
  );

  const updateCartItems = useCallback(
    async (items) => {
      if (!user || operationInProgress) return false;

      setOperationWithTimeout('updateCart');
      
      // Store original cart for rollback
      const originalCart = { ...cart };

      try {
        // Optimistic update
        const optimisticCart = createOptimisticUpdate(cart, (currentCart) => ({
          ...currentCart,
          items: items
        }));

        setCart(optimisticCart);

        // API call
        await apiClient.updateCartItems(items);
        
        // Fetch fresh data to ensure sync
        await fetchCart();
        
        toast.success('Cart updated successfully!');
        return true;
      } catch (error) {
        // Rollback on error
        setCart(originalCart);
        console.error('Update cart items error:', error);
        
        // Handle specific error cases
        if (error.status === 404) {
          // Some items not found in cart, sync with server
          await fetchCart();
          toast.info('Cart has been synchronized');
          return true;
        }
        
        toast.error(error.message || 'Failed to update cart');
        return false;
      } finally {
        clearOperation();
      }
    },
    [user, operationInProgress, cart, fetchCart, setOperationWithTimeout, clearOperation]
  );

  const clearCart = useCallback(async () => {
    if (!user || operationInProgress) return false;

    setOperationWithTimeout('clearCart');
    
    // Store original cart for rollback
    const originalCart = { ...cart };

    try {
      // Optimistic update - immediately clear the cart
      setCart(defaultCart);

      // API call
      await apiClient.clearCart();
      
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      // Rollback on error
      setCart(originalCart);
      console.error('Clear cart error:', error);
      toast.error(error.message || 'Failed to clear cart');
      return false;
    } finally {
      clearOperation();
    }
  }, [user, operationInProgress, cart, setOperationWithTimeout, clearOperation]);

  const applyCoupon = useCallback(
    async (code) => {
      if (!user || operationInProgress) return false;

      setOperationWithTimeout('applyCoupon');
      
      // Store original cart for rollback
      const originalCart = { ...cart };

      try {
        const response = await apiClient.applyCoupon(code);
        const cartData = response?.data?.cart || response?.data || defaultCart;
        updateCartState(cartData);
        toast.success('Coupon applied successfully!');
        return true;
      } catch (error) {
        // Rollback on error
        setCart(originalCart);
        console.error('Apply coupon error:', error);
        toast.error(error.message || 'Invalid coupon code');
        return false;
      } finally {
        clearOperation();
      }
    },
    [user, operationInProgress, cart, updateCartState, setOperationWithTimeout, clearOperation]
  );

  const removeCoupon = useCallback(async () => {
    if (!user || operationInProgress) return false;

    setOperationWithTimeout('removeCoupon');
    
    // Store original cart for rollback
    const originalCart = { ...cart };

    try {
      const response = await apiClient.removeCoupon();
      const cartData = response?.data?.cart || response?.data || defaultCart;
      updateCartState(cartData);
      toast.success('Coupon removed');
      return true;
    } catch (error) {
      // Rollback on error
      setCart(originalCart);
      console.error('Remove coupon error:', error);
      toast.error(error.message || 'Failed to remove coupon');
      return false;
    } finally {
      clearOperation();
    }
  }, [user, operationInProgress, cart, updateCartState, setOperationWithTimeout, clearOperation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearOperationTimeout();
    };
  }, [clearOperationTimeout]);

  const value = {
    cart,
    loading: isLoading,
    isLoading,
    isUpdating: operationInProgress !== null,
    operationInProgress,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItems,
    applyCoupon,
    removeCoupon,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
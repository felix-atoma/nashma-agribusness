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
  if (!cartData) {
    return defaultCart;
  }

  // Handle different possible structures
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

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(defaultCart);
  const [isLoading, setIsLoading] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(null);

  // Add retry logic for fetching cart
  const fetchCartWithRetry = useCallback(async (retryCount = 0) => {
    if (!user) {
      setCart(defaultCart);
      return;
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
      
      const calculatedCart = calculateCartTotals(cartData);
      setCart(calculatedCart);
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
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchCart = useCallback(() => fetchCartWithRetry(0), [fetchCartWithRetry]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user && !isInitialized) {
      fetchCart();
      setIsInitialized(true);
    } else if (!user && isInitialized) {
      setCart(defaultCart);
      setIsInitialized(false);
    }
  }, [user, isInitialized, fetchCart]);

  const addToCart = useCallback(
    async (productOrItems, quantity = 1) => {
      if (!user) {
        toast.error("Please login to add items to cart");
        return false;
      }

      if (operationInProgress) {
        return false;
      }

      setOperationInProgress("addToCart");

      try {
        // Case 1: Bulk add (array of items)
        if (Array.isArray(productOrItems)) {
          // Optimistic update
          setCart((prevCart) => {
            const updatedItems = [...prevCart.items];
            productOrItems.forEach(({ productId, quantity }) => {
              const existing = updatedItems.find(
                (item) =>
                  item.product?._id === productId || item.productId === productId
              );
              if (existing) {
                existing.quantity += quantity;
              } else {
                updatedItems.push({ productId, quantity });
              }
            });
            return calculateCartTotals({ ...prevCart, items: updatedItems });
          });

          // Call backend
          await apiClient.addManyToCart(productOrItems);
          await fetchCart();
          toast.success("Items added to cart!");
          return true;
        }

        // Case 2: Single product
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
        setCart((prevCart) => {
          const existing = prevCart.items.find(
            (item) =>
              item.product?._id === productId || item.productId === productId
          );

          let updatedItems;
          if (existing) {
            updatedItems = prevCart.items.map((item) =>
              item.product?._id === productId || item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedItems = [
              ...prevCart.items,
              { product: productObj, productId, quantity },
            ];
          }

          return calculateCartTotals({ ...prevCart, items: updatedItems });
        });

        // Call backend
        await apiClient.addToCart(productId, quantity);
        await fetchCart();
        toast.success("Item added to cart!");
        return true;
      } catch (error) {
        console.error("Add to cart error:", error);
        await fetchCart();
        toast.error(error.message || "Failed to add item(s) to cart");
        return false;
      } finally {
        setOperationInProgress(null);
      }
    },
    [user, operationInProgress, fetchCart]
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

      setOperationInProgress("removeFromCart");
      
      // Store original cart state for rollback
      const originalCart = { ...cart };
      
      try {
        // Optimistic update - remove item immediately
        setCart((prevCart) => {
          const updatedItems = prevCart.items.filter(
            (item) => {
              const itemProductId = item.product?._id || item.productId;
              return itemProductId !== productId;
            }
          );
          return calculateCartTotals({ ...prevCart, items: updatedItems });
        });

        // Call backend API
        await apiClient.removeFromCart(productId);
        
        // Fetch fresh cart data to ensure consistency
        await fetchCart();
        
        toast.success("Item removed from cart");
        return true;
      } catch (error) {
        console.error("Remove from cart error:", error);
        
        // Rollback optimistic update on error
        setCart(originalCart);
        
        // Only show error if it's not an "item not found" error
        // since that means the item was already removed
        if (error.status !== 404) {
          toast.error(error.message || "Failed to remove item from cart");
        } else {
          // Item was already removed, just sync the cart
          await fetchCart();
          toast.success("Item removed from cart");
          return true;
        }
        return false;
      } finally {
        setOperationInProgress(null);
      }
    },
    [user, operationInProgress, fetchCart, cart]
  );

  const updateCartItem = useCallback(
    async (productId, quantity) => {
      if (!user || operationInProgress) return false;

      setOperationInProgress('updateCartItem');
      
      // Store original cart state for rollback
      const originalCart = { ...cart };
      
      try {
        // Optimistic update
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) => {
            const itemProductId = item.product?._id || item.productId;
            return itemProductId === productId
              ? { ...item, quantity }
              : item;
          }).filter(item => item.quantity > 0); // Remove items with 0 quantity
          
          return calculateCartTotals({ ...prevCart, items: updatedItems });
        });

        await apiClient.updateCartItem(productId, quantity);
        await fetchCart();
        toast.success('Cart item updated successfully!');
        return true;
      } catch (error) {
        console.error('Update cart item error:', error);
        
        // Rollback optimistic update on error
        setCart(originalCart);
        
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
        setOperationInProgress(null);
      }
    },
    [user, operationInProgress, fetchCart, cart]
  );

  const updateCartItems = useCallback(
    async (items) => {
      if (!user || operationInProgress) return false;

      setOperationInProgress('updateCart');
      
      // Store original cart state for rollback
      const originalCart = { ...cart };
      
      try {
        // Optimistic update
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map(cartItem => {
            const itemProductId = cartItem.product?._id || cartItem.productId;
            const update = items.find(item => item.productId === itemProductId);
            return update ? { ...cartItem, quantity: update.quantity } : cartItem;
          }).filter(item => item.quantity > 0); // Remove items with 0 quantity
          
          return calculateCartTotals({ ...prevCart, items: updatedItems });
        });

        await apiClient.updateCartItems(items);
        await fetchCart();
        toast.success('Cart updated successfully!');
        return true;
      } catch (error) {
        console.error('Update cart items error:', error);
        
        // Rollback optimistic update on error
        setCart(originalCart);
        
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
        setOperationInProgress(null);
      }
    },
    [user, operationInProgress, fetchCart, cart]
  );

  const clearCart = useCallback(async () => {
    if (!user || operationInProgress) return false;

    setOperationInProgress('clearCart');
    
    // Store original cart state for rollback
    const originalCart = { ...cart };
    
    try {
      // Optimistic update
      setCart(defaultCart);
      
      await apiClient.clearCart();
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Clear cart error:', error);
      
      // Rollback optimistic update on error
      setCart(originalCart);
      
      await fetchCart();
      toast.error(error.message || 'Failed to clear cart');
      return false;
    } finally {
      setOperationInProgress(null);
    }
  }, [user, operationInProgress, fetchCart, cart]);

  const applyCoupon = useCallback(
    async (code) => {
      if (!user || operationInProgress) return false;

      setOperationInProgress('applyCoupon');
      try {
        const response = await apiClient.applyCoupon(code);
        const cartData = response?.data?.cart || response?.data || defaultCart;
        setCart(calculateCartTotals(cartData));
        toast.success('Coupon applied successfully!');
        return true;
      } catch (error) {
        console.error('Apply coupon error:', error);
        toast.error(error.message || 'Invalid coupon code');
        return false;
      } finally {
        setOperationInProgress(null);
      }
    },
    [user, operationInProgress]
  );

  const removeCoupon = useCallback(async () => {
    if (!user || operationInProgress) return false;

    setOperationInProgress('removeCoupon');
    try {
      const response = await apiClient.removeCoupon();
      const cartData = response?.data?.cart || response?.data || defaultCart;
      setCart(calculateCartTotals(cartData));
      toast.success('Coupon removed');
      return true;
    } catch (error) {
      console.error('Remove coupon error:', error);
      toast.error(error.message || 'Failed to remove coupon');
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
    operationInProgress,
    addToCart,
    removeFromCart,
    updateCartItem,
    updateCartItems,
    applyCoupon,
    removeCoupon,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
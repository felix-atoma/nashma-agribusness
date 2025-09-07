import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponForm from './CouponForm';
import Loader from '../components/Loader';
import CartDebugHelper from './CartDebugHelper';

const CartPage = () => {
  const { 
    cart, 
    loading, 
    isUpdating, 
    operationInProgress, 
    clearCart, 
    fetchCart 
  } = useCart();
  
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [lastCartUpdate, setLastCartUpdate] = useState(Date.now());

  // Track cart changes to force re-renders when needed
  useEffect(() => {
    setLastCartUpdate(Date.now());
  }, [cart?.items?.length, cart?.itemCount, cart?.total]);

  // Enhanced debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== CART PAGE DEBUG ===');
      console.log('Raw cart object:', cart);
      console.log('Cart type:', typeof cart);
      console.log('Cart keys:', cart ? Object.keys(cart) : 'null/undefined');
      console.log('Cart items:', cart?.items);
      console.log('Items type:', typeof cart?.items);
      console.log('Items is array:', Array.isArray(cart?.items));
      console.log('Item count:', cart?.itemCount);
      console.log('Items length:', cart?.items?.length);
      console.log('Loading state:', loading);
      console.log('Is updating:', isUpdating);
      console.log('Operation in progress:', operationInProgress);
      console.log('Last cart update:', lastCartUpdate);
      
      // Check each item structure
      if (cart?.items && Array.isArray(cart.items)) {
        cart.items.forEach((item, index) => {
          console.log(`Item ${index}:`, {
            item,
            hasProduct: !!item.product,
            hasProductId: !!item.productId,
            productId: item.product?._id || item.productId,
            quantity: item.quantity,
            key: `${item.product?._id || item.productId || item._id}-${item.quantity}`
          });
        });
      }
      console.log('=====================');
    }
  }, [cart, loading, isUpdating, operationInProgress, lastCartUpdate]);

  // Force refresh cart on mount if it appears empty - but only once
  useEffect(() => {
    if (!loading && !hasTriedRefresh && (!cart || !cart.items || cart.items.length === 0)) {
      console.log('Cart appears empty, forcing refresh...');
      setHasTriedRefresh(true);
      fetchCart();
    }
  }, [loading, cart, hasTriedRefresh, fetchCart]);

  // Memoize cart items to prevent unnecessary re-renders
  const cartItems = useMemo(() => {
    if (!cart?.items || !Array.isArray(cart.items)) {
      return [];
    }
    
    // Filter out any invalid items and ensure they have required properties
    return cart.items.filter(item => {
      const hasValidProduct = item.product?._id || item.productId;
      const hasValidQuantity = typeof item.quantity === 'number' && item.quantity > 0;
      
      if (!hasValidProduct || !hasValidQuantity) {
        console.warn('Filtering out invalid cart item:', item);
        return false;
      }
      
      return true;
    });
  }, [cart?.items]);

  // Memoize empty state check
  const isEmpty = useMemo(() => {
    const cartExists = !!cart;
    const hasItemsArray = cart && Array.isArray(cart.items);
    const itemsLength = cartItems.length;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Empty check values:', {
        cartExists,
        hasItemsArray,
        itemsLength,
        itemCount: cart?.itemCount
      });
    }
    
    return !cartExists || !hasItemsArray || itemsLength === 0;
  }, [cart, cartItems.length]);

  // Handle clear cart with confirmation
  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
    
    try {
      await clearCart();
      // Force a small delay to ensure UI updates
      setTimeout(() => {
        setLastCartUpdate(Date.now());
      }, 100);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [clearCart]);

  // Handle force refresh
  const handleForceRefresh = useCallback(async () => {
    try {
      await fetchCart();
      setLastCartUpdate(Date.now());
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <Loader className="min-h-[400px]" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-3xl mx-auto py-12 px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Ready to start shopping? Browse our products and add items you love to your cart.</p>
          
          {/* User-friendly actions */}
          <div className="space-y-4">
            <Link 
              to="/products" 
              className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start Shopping
            </Link>
            
            {/* Optional: Show popular categories or featured products */}
            <div className="text-sm text-gray-500">
              <p>Not sure where to start? Check out our popular categories:</p>
              <div className="flex justify-center gap-4 mt-2">
                <Link to="/products?category=potash" className="text-green-600 hover:text-green-700">Potash</Link>
                <Link to="/products?category=soap" className="text-green-600 hover:text-green-700">Black Soap</Link>
                <Link to="/products?category=training" className="text-green-600 hover:text-green-700">Training</Link>
              </div>
            </div>
          </div>

          {/* Debug toggle - only show in development */}
          {(process.env.NODE_ENV === 'development') && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="text-sm text-gray-400 hover:text-gray-600 mr-4"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </button>
              
              <button 
                onClick={handleForceRefresh}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                Force Refresh
              </button>
              
              {showDebug && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4 text-left text-sm">
                  <strong>Debug Info:</strong>
                  <div>Cart exists: {!!cart ? 'Yes' : 'No'}</div>
                  <div>Has items array: {Array.isArray(cart?.items) ? 'Yes' : 'No'}</div>
                  <div>Items array length: {cart?.items?.length || 0}</div>
                  <div>Filtered items length: {cartItems.length}</div>
                  <div>Item count property: {cart?.itemCount || 0}</div>
                  <div>Loading: {loading ? 'Yes' : 'No'}</div>
                  <div>Is updating: {isUpdating ? 'Yes' : 'No'}</div>
                  <div>Operation: {operationInProgress || 'None'}</div>
                  <div>Last update: {new Date(lastCartUpdate).toLocaleTimeString()}</div>
                  
                  {cart && (
                    <div className="mt-2">
                      <strong>Cart structure:</strong>
                      <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40 mt-1">
                        {JSON.stringify(cart, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/products"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart ({cart?.itemCount || cartItems.length} {(cart?.itemCount || cartItems.length) === 1 ? 'item' : 'items'})
          </h1>
          <button 
            onClick={handleClearCart}
            disabled={isUpdating}
            className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Cart
          </button>
        </div>

        {/* Global loading indicator */}
        {isUpdating && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-blue-700 text-sm">
              {operationInProgress === 'clearCart' ? 'Clearing cart...' : 
               operationInProgress?.includes('removeFromCart') ? 'Removing item...' :
               operationInProgress?.includes('updateQuantity') ? 'Updating quantity...' :
               'Updating cart...'}
            </span>
          </div>
        )}

        {/* Debug panel - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <details>
              <summary className="text-sm font-medium text-blue-800 cursor-pointer">
                Cart Debug Info - Items Found: {cartItems.length} (Raw: {cart?.items?.length || 0})
              </summary>
              <div className="mt-2 text-xs text-blue-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>Items count: {cart?.itemCount}</div>
                  <div>Raw array length: {cart?.items?.length}</div>
                  <div>Filtered array length: {cartItems.length}</div>
                  <div>Subtotal: ${cart?.subtotal?.toFixed(2)}</div>
                  <div>Total: ${cart?.total?.toFixed(2)}</div>
                  <div>Is updating: {isUpdating ? 'Yes' : 'No'}</div>
                  <div>Operation: {operationInProgress || 'None'}</div>
                  <div>Last update: {new Date(lastCartUpdate).toLocaleTimeString()}</div>
                </div>
                
                {cartItems.length > 0 && (
                  <div className="mt-2">
                    <strong>Individual Items (Filtered):</strong>
                    {cartItems.map((item, index) => {
                      const productId = item.product?._id || item.productId || item._id;
                      const itemKey = `${productId}-${item.quantity}`;
                      
                      return (
                        <div key={index} className="ml-2 mt-1 p-2 bg-white rounded">
                          <div>Item {index + 1} (Key: {itemKey}):</div>
                          <div>Product ID: {productId || 'Missing'}</div>
                          <div>Product Name: {item.product?.name || 'Missing name'}</div>
                          <div>Quantity: {item.quantity || 'Missing quantity'}</div>
                          <div>Price: ${item.product?.price || item.price || 'Missing price'}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <button 
                  onClick={handleForceRefresh}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 mr-2"
                >
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  Force Refresh Cart
                </button>
                
                <details className="mt-2">
                  <summary className="cursor-pointer">Full Cart Object</summary>
                  <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(cart, null, 2)}
                  </pre>
                </details>
              </div>
            </details>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              {cartItems.length > 0 ? (
                <div className="space-y-0 divide-y divide-gray-200">
                  {cartItems.map((item, index) => {
                    // Create a stable, unique key
                    const productId = item.product?._id || item.productId || item._id;
                    const itemKey = `${productId}-${item.quantity}-${lastCartUpdate}`;
                    
                    if (process.env.NODE_ENV === 'development') {
                      console.log(`Rendering CartItem ${index}:`, {
                        item,
                        key: itemKey,
                        productId,
                        quantity: item.quantity
                      });
                    }
                    
                    return (
                      <div key={itemKey} className="first:pt-0 last:pb-0">
                        <CartItem item={item} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No items to display</p>
                  <button 
                    onClick={handleForceRefresh}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Refresh Cart
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-1 space-y-6">
            <CartSummary />
            <CouponForm />
            {process.env.NODE_ENV === 'development' && <CartDebugHelper />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
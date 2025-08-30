import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponForm from './CouponForm';
import Loader from '../components/Loader'
import CartDebugHelper from './CartDebugHelper'

const CartPage = () => {
  const { cart, loading, clearCart, fetchCart } = useCart();

  // Enhanced debug logging
  useEffect(() => {
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
    
    // Check each item structure
    if (cart?.items && Array.isArray(cart.items)) {
      cart.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          item,
          hasProduct: !!item.product,
          hasProductId: !!item.productId,
          productId: item.product?._id || item.productId,
          quantity: item.quantity
        });
      });
    }
    console.log('=====================');
  }, [cart, loading]);

  // Force refresh cart on mount if it appears empty - but only once
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);
  
  useEffect(() => {
    if (!loading && !hasTriedRefresh && (!cart || !cart.items || cart.items.length === 0)) {
      console.log('Cart appears empty, forcing refresh...');
      setHasTriedRefresh(true);
      fetchCart();
    }
  }, [loading, cart?.items?.length, hasTriedRefresh]); // More specific dependencies

  if (loading) {
    return <Loader className="min-h-[400px]" />;
  }

  // More detailed empty check with logging
  const cartExists = !!cart;
  const hasItemsArray = cart && Array.isArray(cart.items);
  const itemsLength = cart?.items?.length || 0;
  const itemCount = cart?.itemCount || 0;
  
  console.log('Empty check values:', {
    cartExists,
    hasItemsArray,
    itemsLength,
    itemCount
  });

  // Check if cart is empty using multiple conditions
  const isEmpty = !cartExists || 
                  !hasItemsArray || 
                  itemsLength === 0;

  if (isEmpty) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        
        {/* Enhanced debug info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm">
          <strong>Debug Info:</strong>
          <div>Cart exists: {cartExists ? 'Yes' : 'No'}</div>
          <div>Has items array: {hasItemsArray ? 'Yes' : 'No'}</div>
          <div>Items array length: {itemsLength}</div>
          <div>Item count property: {itemCount}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Cart object: {cart ? 'Exists' : 'Null/Undefined'}</div>
          {cart && (
            <div className="mt-2">
              <strong>Cart structure:</strong>
              <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40 mt-1">
                {JSON.stringify(cart, null, 2)}
              </pre>
            </div>
          )}
          <button 
            onClick={fetchCart}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
          >
            Force Refresh Cart
          </button>
        </div>
        
        <Link 
          to="/products" 
          className="inline-flex items-center bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
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
          Your Cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
        </h1>
        <button 
          onClick={clearCart}
          className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear Cart
        </button>
      </div>

      {/* Enhanced debug panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <details>
          <summary className="text-sm font-medium text-blue-800 cursor-pointer">
            Cart Debug Info - Items Found: {cart.items?.length || 0}
          </summary>
          <div className="mt-2 text-xs text-blue-700">
            <div>Items count: {cart.itemCount}</div>
            <div>Items array length: {cart.items?.length}</div>
            <div>Subtotal: ${cart.subtotal?.toFixed(2)}</div>
            <div>Total: ${cart.total?.toFixed(2)}</div>
            
            {cart.items?.length > 0 && (
              <div className="mt-2">
                <strong>Individual Items:</strong>
                {cart.items.map((item, index) => (
                  <div key={index} className="ml-2 mt-1 p-2 bg-white rounded">
                    <div>Item {index + 1}:</div>
                    <div>Product ID: {item.product?._id || item.productId || 'Missing'}</div>
                    <div>Product Name: {item.product?.name || 'Missing name'}</div>
                    <div>Quantity: {item.quantity || 'Missing quantity'}</div>
                    <div>Price: ${item.product?.price || item.price || 'Missing price'}</div>
                  </div>
                ))}
              </div>
            )}
            
            <details className="mt-2">
              <summary className="cursor-pointer">Full Cart Object</summary>
              <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(cart, null, 2)}
              </pre>
            </details>
          </div>
        </details>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          {cart.items && cart.items.length > 0 ? (
            cart.items.map((item, index) => {
              console.log(`Rendering CartItem ${index}:`, item);
              return (
                <CartItem 
                  key={item.product?._id || item.productId || item._id || index} 
                  item={item} 
                />
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items to display (but cart is not empty?)
            </div>
          )}
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <CartSummary />
          <CouponForm />
          <CartDebugHelper />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
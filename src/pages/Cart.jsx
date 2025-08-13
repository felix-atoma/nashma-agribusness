import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponForm from './CouponForm';
import Loader from '../components/Loader'

const CartPage = () => {
  const { cart, loading, clearCart } = useCart();

  // Debug logging
  useEffect(() => {
    console.log('=== CART PAGE DEBUG ===');
    console.log('Cart object:', cart);
    console.log('Cart items:', cart?.items);
    console.log('Item count:', cart?.itemCount);
    console.log('Items length:', cart?.items?.length);
    console.log('Loading state:', loading);
    console.log('=====================');
  }, [cart, loading]);

  if (loading) {
    return <Loader className="min-h-[400px]" />;
  }

  // Check if cart is empty using multiple conditions
  const isEmpty = !cart || 
                  !cart.items || 
                  cart.items.length === 0 ||
                  cart.itemCount === 0;

  if (isEmpty) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        
        {/* Debug info - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm">
            <strong>Debug Info:</strong>
            <div>Cart exists: {cart ? 'Yes' : 'No'}</div>
            <div>Items array: {cart?.items ? `Length ${cart.items.length}` : 'No items array'}</div>
            <div>Item count: {cart?.itemCount ?? 'undefined'}</div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
          </div>
        )}
        
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

      {/* Debug panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <details>
            <summary className="text-sm font-medium text-blue-800 cursor-pointer">
              Cart Debug Info (Development Only)
            </summary>
            <div className="mt-2 text-xs text-blue-700">
              <div>Items count: {cart.itemCount}</div>
              <div>Items array length: {cart.items?.length}</div>
              <div>Subtotal: ${cart.subtotal?.toFixed(2)}</div>
              <div>Total: ${cart.total?.toFixed(2)}</div>
              <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(cart, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          {cart.items.map((item, index) => (
            <CartItem 
              key={item.product?._id || item.productId || item._id || index} 
              item={item} 
            />
          ))}
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <CartSummary />
          <CouponForm />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
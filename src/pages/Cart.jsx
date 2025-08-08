import React from 'react';
import { useCart } from '../context/CartContext'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponForm from './CouponForm';
import Loader from '../components/Loader'

const CartPage = () => {
  const { cart, loading, clearCart } = useCart();

  if (loading) return <Loader className="min-h-[400px]" />;

  if (cart.itemCount === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
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
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Your Cart ({cart.itemCount} items)</h1>
        <button 
          onClick={clearCart}
          className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear Cart
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          {cart.items.map(item => (
            <CartItem key={item.product._id} item={item} />
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
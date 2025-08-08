import React from 'react';
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { cart, removeCoupon } = useCart();

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="font-bold text-lg mb-5">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({cart.itemCount} items)</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
        
        {cart.discount > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${cart.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium text-green-800">
                {cart.coupon.code}
              </span>
              <button 
                onClick={removeCoupon}
                className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </>
        )}
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Link
        to="/checkout"
        className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors mt-6"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;
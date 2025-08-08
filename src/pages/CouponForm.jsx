import React, { useState } from 'react';
import { useCart } from '../context/CartContext'
import { Tag, X, Loader2 } from 'lucide-react';

const CouponForm = () => {
  const [code, setCode] = useState('');
  const { applyCoupon, loading, cart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyCoupon(code);
      setCode('');
    } catch (error) {
      // Error is already handled in the context
    }
  };

  if (cart.coupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <Tag className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">
            {cart.coupon.code} applied (-${cart.discount.toFixed(2)})
          </span>
        </div>
        <button
          onClick={() => setCode('')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Have a coupon code?
      </label>
      <div className="flex">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white px-4 py-2 rounded-r-lg hover:bg-gray-700 transition-colors disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
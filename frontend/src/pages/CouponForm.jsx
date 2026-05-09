import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Tag, Loader2 } from 'lucide-react';

const CouponForm = () => {
  const [code, setCode] = useState('');
  const { applyCoupon, loading, cart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    await applyCoupon(code.trim());
    setCode('');
  };

  // Coupon already applied — show nothing here; CartSummary renders it inline
  if (cart?.coupon) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm px-6 py-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Have a coupon?
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder:text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
        </button>
      </form>
    </div>
  );
};

export default CouponForm;

import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Phone } from 'lucide-react';

const CartSummary = () => {
  const { cart } = useCart();

  const itemCount = cart?.itemCount ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <h3 className="font-bold text-lg text-gray-900">Order Summary</h3>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Item count */}
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Total items</span>
          <span className="font-semibold text-gray-900">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Delivery info */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Payment on Delivery</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Prices are confirmed when your order is delivered. No upfront payment required.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-700">
                Our team will contact you to confirm your order and arrange delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          to="/checkout"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Place Order — Pay on Delivery
        </Link>
        <Link
          to="/products"
          className="block w-full text-center text-xs text-gray-400 hover:text-green-600 transition-colors mt-3"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;

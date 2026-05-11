import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Tag } from 'lucide-react';

const DELIVERY_FEE       = 20;    // GHS flat delivery fee
const FREE_DELIVERY_MIN  = 500;   // Free delivery above this subtotal

const CartSummary = () => {
  const { cart } = useCart();

  const subtotal    = cart?.subtotal ?? 0;
  const discount    = cart?.discount ?? 0;
  const itemCount   = cart?.itemCount ?? 0;
  const coupon      = cart?.coupon;
  const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total       = Math.max(0, subtotal - discount + deliveryFee);

  const canCheckout = itemCount > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900">Order Summary</h3>
      </div>

      <div className="px-6 py-5 space-y-3 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-gray-900">GHS {subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {coupon?.code ? `Coupon (${coupon.code})` : 'Discount'}
            </span>
            <span className="font-semibold">− GHS {discount.toFixed(2)}</span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            Delivery
          </span>
          {deliveryFee === 0 ? (
            <span className="font-semibold text-green-600">Free</span>
          ) : (
            <span className="font-semibold text-gray-900">GHS {deliveryFee.toFixed(2)}</span>
          )}
        </div>

        {/* Free delivery progress */}
        {deliveryFee > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            Add <strong>GHS {(FREE_DELIVERY_MIN - subtotal).toFixed(2)}</strong> more for free delivery
            <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_MIN) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-gray-100 pt-3">
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-900">Total</span>
            <span className="text-green-700">GHS {total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Inclusive of all charges · Pay on delivery</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 space-y-3">
        <Link
          to="/checkout"
          className={`flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            canCheckout
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          onClick={e => { if (!canCheckout) e.preventDefault(); }}
        >
          <ShoppingBag className="w-4 h-4" />
          Proceed to Checkout
        </Link>
        <Link
          to="/products"
          className="block text-center text-xs text-gray-400 hover:text-green-600 transition-colors"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;

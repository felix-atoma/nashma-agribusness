import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, ArrowLeft, Trash2, RefreshCw, Shield, Truck, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CouponForm from './CouponForm';

const CartPage = () => {
  const { cart, loading, isUpdating, operationInProgress, clearCart, fetchCart } = useCart();
  const [didInitialFetch, setDidInitialFetch] = useState(false);

  // One-time refresh on mount if cart appears empty
  useEffect(() => {
    if (!loading && !didInitialFetch && (!cart?.items || cart.items.length === 0)) {
      setDidInitialFetch(true);
      fetchCart();
    }
  }, [loading, cart, didInitialFetch, fetchCart]);

  const cartItems = useMemo(() => {
    if (!Array.isArray(cart?.items)) return [];
    return cart.items.filter((item) => {
      const id = item.product?._id || item.productId;
      return id && typeof item.quantity === 'number' && item.quantity > 0;
    });
  }, [cart?.items]);

  const isEmpty = !loading && cartItems.length === 0;

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Remove all items from your cart?')) return;
    await clearCart();
  }, [clearCart]);

  const updatingMessage = useMemo(() => {
    if (!isUpdating) return null;
    if (operationInProgress === 'clearCart') return 'Clearing cart…';
    if (operationInProgress?.includes('remove')) return 'Removing item…';
    if (operationInProgress?.includes('update')) return 'Updating quantity…';
    return 'Updating cart…';
  }, [isUpdating, operationInProgress]);

  /* ─── Loading ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your cart…</p>
        </div>
      </div>
    );
  }

  /* ─── Empty state ─────────────────────────────────── */
  if (isEmpty) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-sm p-12">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Discover our natural cocoa potash, shea butter, and agribusiness products.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-xl hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Products
            </Link>
            <div className="mt-6 flex justify-center gap-6 text-sm text-gray-400">
              <Link to="/products?category=potash" className="hover:text-green-600 transition-colors">Cocoa Potash</Link>
              <Link to="/products?category=soap" className="hover:text-green-600 transition-colors">Black Soap</Link>
              <Link to="/products?category=commodities" className="hover:text-green-600 transition-colors">Bulk Orders</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Cart with items ─────────────────────────────── */
  return (
    <div className="min-h-screen pt-20 bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            My Cart{' '}
            <span className="text-base font-normal text-gray-400">
              ({cart?.itemCount || cartItems.length}{' '}
              {(cart?.itemCount || cartItems.length) === 1 ? 'item' : 'items'})
            </span>
          </h1>

          <button
            onClick={handleClearCart}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 text-red-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        {/* Updating indicator */}
        {isUpdating && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-green-600 animate-spin" />
            <span className="text-green-700 text-sm font-medium">{updatingMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Items list ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">Cart Items</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {cartItems.length} {cartItems.length === 1 ? 'product' : 'products'}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => {
                  const productId = item.product?._id || item.productId || item._id;
                  return <CartItem key={productId} item={item} />;
                })}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <CartSummary />
            <CouponForm />

            {/* Trust badges */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Why shop with us</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Secure Checkout</p>
                    <p className="text-xs text-gray-400">Your information is protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Fast Delivery</p>
                    <p className="text-xs text-gray-400">Kumasi & nationwide shipping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">100% Natural</p>
                    <p className="text-xs text-gray-400">No additives, certified organic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

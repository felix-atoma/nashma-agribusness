import { useMemo, useCallback } from 'react';
import { ShoppingBag, ShoppingCart, Trash2, RefreshCw, Shield, Truck, Leaf, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../pages/CartItem';
import Offcanvas from './Offcanvas';

const DELIVERY_FEE      = 20;
const FREE_DELIVERY_MIN = 500;

export default function CartDrawer() {
  const {
    cart, loading, isUpdating, operationInProgress,
    cartOpen, closeCart, openCheckout, clearCart,
  } = useCart();

  const cartItems = useMemo(() => {
    if (!Array.isArray(cart?.items)) return [];
    return cart.items.filter(item => {
      const id = item.product?._id || item.productId;
      return id && typeof item.quantity === 'number' && item.quantity > 0;
    });
  }, [cart?.items]);

  const subtotal    = cart?.subtotal ?? 0;
  const discount    = cart?.discount ?? 0;
  const coupon      = cart?.coupon;
  const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total       = Math.max(0, subtotal - discount + deliveryFee);

  const updatingMessage = useMemo(() => {
    if (!isUpdating) return null;
    if (operationInProgress === 'clearCart') return 'Clearing cart…';
    if (operationInProgress?.includes('remove')) return 'Removing item…';
    if (operationInProgress?.includes('update')) return 'Updating quantity…';
    return 'Updating cart…';
  }, [isUpdating, operationInProgress]);

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Remove all items from your cart?')) return;
    await clearCart();
  }, [clearCart]);

  const handleCheckout = () => {
    openCheckout();
  };

  return (
    <Offcanvas
      isOpen={cartOpen}
      onClose={closeCart}
      title={`My Cart ${cart?.itemCount ? `(${cart.itemCount})` : ''}`}
      width="w-full sm:max-w-[480px]"
    >
      <div className="flex flex-col h-full">

        {/* Updating indicator */}
        {isUpdating && (
          <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-xl p-2.5 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-green-600 animate-spin flex-shrink-0" />
            <span className="text-green-700 text-xs font-medium">{updatingMessage}</span>
          </div>
        )}

        {/* Loading */}
        {loading && cartItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading your cart…</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && cartItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <ShoppingBag className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Discover our natural products and add them here.
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition-all font-semibold text-sm shadow"
              >
                <ShoppingCart className="w-4 h-4" />
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Cart items */}
        {cartItems.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-50">
                {cartItems.map(item => {
                  const productId = item.product?._id || item.productId || item._id;
                  return <CartItem key={productId} item={item} />;
                })}
              </div>

              {/* Trust badges */}
              <div className="mx-4 my-4 bg-gray-50 rounded-xl p-4 space-y-2.5">
                {[
                  { icon: Shield, text: 'Secure checkout — your data is protected' },
                  { icon: Truck,  text: 'Delivery across Ghana · confirmed by phone' },
                  { icon: Leaf,   text: '100% natural, certified Nashma products' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                    <Icon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary + CTA */}
            <div className="border-t border-gray-100 p-4 space-y-3 bg-white flex-shrink-0">
              {/* Totals */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({cart?.itemCount ?? cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">GHS {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {coupon?.code ? `Coupon (${coupon.code})` : 'Discount'}
                    </span>
                    <span className="font-medium">− GHS {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    Delivery
                  </span>
                  {deliveryFee === 0
                    ? <span className="font-medium text-green-600">Free</span>
                    : <span className="font-medium text-gray-900">GHS {deliveryFee.toFixed(2)}</span>
                  }
                </div>
                {deliveryFee > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
                    Add <strong>GHS {(FREE_DELIVERY_MIN - subtotal).toFixed(2)}</strong> more for free delivery
                    <div className="mt-1.5 h-1 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_MIN) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-dashed border-gray-100 pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-700">GHS {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm"
              >
                Proceed to Checkout · GHS {total.toFixed(2)}
              </button>

              {/* Secondary actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={closeCart}
                  className="text-xs text-gray-400 hover:text-green-600 transition-colors"
                >
                  ← Continue Shopping
                </button>
                <button
                  onClick={handleClearCart}
                  disabled={isUpdating}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Offcanvas>
  );
}

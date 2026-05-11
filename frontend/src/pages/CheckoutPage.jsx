import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLeaf } from 'react-icons/fa';
import { ShoppingBag, Truck, CreditCard, ChevronDown, ChevronUp, Shield, CheckCircle } from 'lucide-react';

const DELIVERY_FEE      = 20;
const FREE_DELIVERY_MIN = 500;

const GH_REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
  'Volta', 'Oti', 'Northern', 'North East', 'Savannah',
  'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
  'Western North',
];

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all placeholder-gray-400';

const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

export default function CheckoutPage() {
  const { placeOrder, loading } = useOrder();
  const { cart }                = useCart();
  const { user, isAuthenticated, initialized, loading: authLoading } = useAuth();
  const navigate                = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', region: '', country: 'Ghana',
    paymentMethod: 'cod',
  });

  const [showSummary, setShowSummary] = useState(false);

  // Pre-fill from user profile
  useEffect(() => {
    if (!user) return;
    setForm(prev => ({
      ...prev,
      firstName: user.firstName || prev.firstName,
      lastName:  user.lastName  || prev.lastName,
      email:     user.email     || prev.email,
      phone:     user.phone     || prev.phone,
    }));
  }, [user]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      toast.error('Please log in to place your order');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [initialized, isAuthenticated, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Price calculations
  const cartItems   = cart?.items || [];
  const subtotal    = cart?.subtotal ?? 0;
  const discount    = cart?.discount ?? 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total       = Math.max(0, subtotal - discount + deliveryFee);

  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'region'];
  const isValid = requiredFields.every(f => form[f].trim().length > 0);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to place an order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    const orderItems = cartItems.map(item => ({
      product:          item.product?._id || item.productId,
      productId:        item.product?._id || item.productId,
      quantity:         item.quantity,
      price:            item.priceAtAddition ?? item.product?.price ?? 0,
      name:             item.product?.name || 'Product',
      image:            item.product?.image || '',
    }));

    try {
      const res = await placeOrder({
        items:           orderItems,
        subtotal,
        discount,
        totalPrice:      total,
        paymentMethod:   form.paymentMethod,
        shippingAddress: {
          firstName: form.firstName.trim(),
          lastName:  form.lastName.trim(),
          email:     form.email.trim(),
          phone:     form.phone.trim(),
          address:   form.address.trim(),
          city:      form.region.trim(),
          state:     form.region.trim(),
          zipCode:   '00000',
          country:   'Ghana',
        },
        userId: user._id || user.id,
      });

      navigate('/order-success', {
        state: {
          order: {
            ...res?.data?.order,
            items:           orderItems,
            subtotal,
            deliveryFee,
            total,
            shippingAddress: {
              firstName: form.firstName,
              lastName:  form.lastName,
              phone:     form.phone,
              address:   form.address,
              region:    form.region,
            },
            paymentMethod: form.paymentMethod,
          },
        },
      });
    } catch {
      // toast handled by OrderContext
    }
  };

  /* ─── Loading / redirect states ─── */
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
          <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Add some products before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  /* ─── Main checkout ─── */
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-3">
            <FaLeaf className="w-4 h-4" />
            Nashma Agribusiness — Secure Checkout
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── LEFT: Form ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Customer details */}
            <Section title="1. Contact Details">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} placeholder="Kwame" />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Mensah" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@email.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+233 24 000 0000" />
                </div>
              </div>
            </Section>

            {/* Delivery address */}
            <Section title="2. Delivery Address">
              <div>
                <label className={labelClass}>Street / Area Address *</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Adum, near Market Circle, Kumasi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelClass}>Region *</label>
                  <select name="region" value={form.region} onChange={handleChange} className={inputClass}>
                    <option value="">Select region…</option>
                    {GH_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input name="country" value="Ghana" readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                </div>
              </div>
            </Section>

            {/* Payment method */}
            <Section title="3. Payment Method">
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.paymentMethod === 'cod'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mt-0.5 accent-green-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900 text-sm">Cash on Delivery</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Recommended</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Pay when your order arrives. Our team will call to confirm before dispatch.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-not-allowed opacity-50 border-gray-200`}>
                  <input type="radio" name="paymentMethod" value="momo" disabled className="mt-0.5 accent-green-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-500 text-sm">Mobile Money (MoMo)</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Coming soon</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">MTN, Vodafone, AirtelTigo — available soon.</p>
                  </div>
                </label>
              </div>
            </Section>

          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Mobile summary toggle */}
            <button
              type="button"
              onClick={() => setShowSummary(v => !v)}
              className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3.5 shadow-sm"
            >
              <span className="text-sm font-semibold text-gray-900">
                {showSummary ? 'Hide' : 'Show'} order summary
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-700 text-sm">GHS {total.toFixed(2)}</span>
                {showSummary ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {/* Summary card */}
            <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${!showSummary ? 'hidden lg:block' : ''}`}>
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Order Summary</h3>
              </div>

              {/* Items */}
              <div className="px-5 py-3 space-y-3 border-b border-gray-100 max-h-56 overflow-y-auto">
                {cartItems.map((item, i) => {
                  const name  = item.product?.name || 'Product';
                  const price = item.priceAtAddition ?? item.product?.price ?? 0;
                  const img   = item.product?.image || item.product?.images?.[0] || null;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        {img && (
                          <img src={img} alt={name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        GHS {(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">GHS {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">− GHS {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    Delivery
                  </span>
                  {deliveryFee === 0
                    ? <span className="text-green-600 font-medium">Free</span>
                    : <span className="text-gray-900 font-medium">GHS {deliveryFee.toFixed(2)}</span>
                  }
                </div>
                <div className="flex justify-between font-bold text-base border-t border-dashed border-gray-100 pt-2.5 mt-1">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-700">GHS {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="px-5 pb-5 space-y-2">
                {[
                  { icon: Shield,       text: 'Secure checkout — your data is protected' },
                  { icon: Truck,        text: 'Delivery across Ghana · confirmed by phone' },
                  { icon: CheckCircle,  text: '100% natural, certified Nashma products' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                    <Icon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Place order */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !isValid}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order…
                </span>
              ) : (
                `Place Order · GHS ${total.toFixed(2)}`
              )}
            </button>
            <p className="text-xs text-center text-gray-400">
              By placing your order you agree to our terms. Payment is collected on delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 text-base">{title}</h2>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

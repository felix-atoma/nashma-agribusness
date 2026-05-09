import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTruck, FaShieldAlt, FaLeaf, FaBoxOpen, FaPhone } from 'react-icons/fa';

const CheckoutPage = () => {
  const { placeOrder, loading } = useOrder();
  const { cart } = useCart();
  const { user, isAuthenticated, initialized, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: 'Ghana',
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      toast.error('Please log in to continue with checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [initialized, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isEmpty = (v) => !v || v.toString().trim() === '';

  const missingFields = ['firstName','lastName','email','phone','address','city','state','zipCode','country']
    .filter(f => isEmpty(form[f]));

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to place an order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (missingFields.length) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      return;
    }

    const orderItems = cart.items.map(item => ({
      product: item.product?._id || item.productId,
      productId: item.product?._id || item.productId,
      quantity: item.quantity,
      price: item.priceAtAddition || item.product?.price || 0,
      name: item.product?.name || 'Product',
      image: item.product?.image || '',
    }));

    try {
      const res = await placeOrder({
        items: orderItems,
        totalPrice: cart.total,
        subtotal: cart.subtotal,
        discount: cart.discount || 0,
        paymentMethod: 'cod',
        shippingAddress: { ...form },
        userId: user._id || user.id,
      });

      navigate('/order-success', {
        state: {
          order: {
            ...res.data?.order,
            items: orderItems,
            total: cart.total,
            subtotal: cart.subtotal,
            shippingAddress: { ...form },
            paymentMethod: 'cod',
          },
        },
      });
    } catch (err) {
      // toast already shown by OrderContext
    }
  };

  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-700 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm">
          <FaBoxOpen className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Your cart is empty</h2>
          <p className="text-green-600 mb-6">Add some items before checking out.</p>
          <button onClick={() => navigate('/products')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const fieldClass = (name) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
      isEmpty(form[name])
        ? 'border-red-300 bg-red-50 focus:ring-red-200'
        : 'border-gray-200 bg-white focus:ring-green-200 focus:border-green-400'
    }`;

  const Label = ({ children }) => (
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-900">Checkout</h1>
          <p className="text-green-600 mt-1">Complete your order from Nashma Agribusiness</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Shipping form ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <FaTruck className="w-5 h-5" />, text: 'Free Delivery in Kumasi' },
                { icon: <FaShieldAlt className="w-5 h-5" />, text: 'Secure Order' },
                { icon: <FaLeaf className="w-5 h-5" />, text: '100% Organic' },
              ].map((b, i) => (
                <div key={i} className="bg-white rounded-xl border border-green-100 p-3 flex flex-col items-center text-center shadow-sm">
                  <span className="text-green-600 mb-1">{b.icon}</span>
                  <span className="text-xs font-medium text-green-800">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Shipping card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-green-900 mb-6 flex items-center gap-2">
                <FaTruck className="text-green-600" /> Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <input name="firstName" value={form.firstName} onChange={handleChange}
                    placeholder="e.g. Akosua" className={fieldClass('firstName')} />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <input name="lastName" value={form.lastName} onChange={handleChange}
                    placeholder="e.g. Mensah" className={fieldClass('lastName')} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com" className={fieldClass('email')} />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+233 24 000 0000" className={fieldClass('phone')} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Street Address *</Label>
                  <input name="address" value={form.address} onChange={handleChange}
                    placeholder="House/Street number and name" className={fieldClass('address')} />
                </div>
                <div>
                  <Label>City *</Label>
                  <input name="city" value={form.city} onChange={handleChange}
                    placeholder="e.g. Kumasi" className={fieldClass('city')} />
                </div>
                <div>
                  <Label>Region / State *</Label>
                  <input name="state" value={form.state} onChange={handleChange}
                    placeholder="e.g. Ashanti" className={fieldClass('state')} />
                </div>
                <div>
                  <Label>Postal / ZIP Code *</Label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange}
                    placeholder="e.g. 00233" className={fieldClass('zipCode')} />
                </div>
                <div>
                  <Label>Country *</Label>
                  <input name="country" value={form.country} onChange={handleChange}
                    placeholder="Ghana" className={fieldClass('country')} />
                </div>
              </div>
            </div>

            {/* Payment method (display only) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-green-900 mb-4">Payment Method</h2>
              <div className="flex items-start gap-4 p-4 bg-green-50 border-2 border-green-400 rounded-xl">
                <div className="w-5 h-5 rounded-full border-2 border-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Payment on Delivery</p>
                  <p className="text-sm text-green-700 mt-0.5">No upfront payment required. Pay when your order arrives.</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <FaPhone className="w-3 h-3" />
                    Our team will call you to confirm price and delivery details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-green-900 mb-5">
                Your Order
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                </span>
              </h2>

              {/* Items — name + image + qty only, no prices */}
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {cart.items.map((item, i) => {
                  const name = item.product?.name || 'Product';
                  const img = item.product?.images?.[0] || item.product?.image || null;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-amber-50 flex-shrink-0 border border-gray-100">
                        {img ? (
                          <img
                            src={img}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-green-600 text-xs font-bold text-center px-1">
                            {name.split(' ').slice(0, 2).join(' ')}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                          POD
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment on Delivery notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-2.5">
                  <FaTruck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Payment on Delivery</p>
                    <p className="text-xs text-green-700 mt-1">
                      Prices vary. Our team will confirm exact pricing when we contact you to arrange delivery.
                    </p>
                  </div>
                </div>
              </div>

              {missingFields.length > 0 && (
                <p className="text-xs text-red-500 mb-3 bg-red-50 border border-red-100 rounded-lg p-2">
                  Please fill in all required fields to place your order.
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || missingFields.length > 0 || !cart.items.length}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  'Place Order — Pay on Delivery'
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                No payment now. You pay when your order arrives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

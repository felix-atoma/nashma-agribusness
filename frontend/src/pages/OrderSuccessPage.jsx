// pages/OrderSuccessPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { CheckCircle, Package, Truck, Clock, Mail, Phone, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrder();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Resolve order from location state (passed by CheckoutPage on success)
    const orderData = location.state?.order;
    if (orderData) {
      setOrder(orderData);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  const handleContactSupport = () => {
    const subject = `Support Request for Order #${order?._id?.slice(-8).toUpperCase() || ''}`;
    window.open(`mailto:nashmafarms@gmail.com?subject=${encodeURIComponent(subject)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your order details...</h2>
          <p className="text-gray-600">Please wait while we confirm your order.</p>
        </div>
      </div>
    );
  }

  const orderData = order || {
    _id: 'pending',
    status: 'confirmed',
    paymentMethod: location.state?.paymentMethod || 'cod',
    items: location.state?.items || [],
    shippingAddress: location.state?.shippingAddress || {},
    createdAt: new Date()
  };

  const shippingInfo = orderData.shippingAddress || {};
  const hasShippingInfo = Object.values(shippingInfo).some(val => val && val.toString().trim() !== '');
  const orderId = orderData._id || orderData.id;
  const shortOrderId = orderId && orderId !== 'pending' ? orderId.slice(-8).toUpperCase() : 'Processing...';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-700 mb-2">
            Thank you for choosing Nashma Agribusiness. Your order has been successfully placed.
          </p>
          <p className="text-green-700 font-semibold mb-6">
            Order #: {shortOrderId}
          </p>

          {/* What happens next */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4 text-left">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-amber-600" />
              What happens next?
            </h3>
            <ul className="space-y-3 text-amber-800">
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                <span>
                  Our team will <strong>call you shortly</strong> to confirm your order details and agree on the final price.
                </span>
              </li>
              <li className="flex items-start">
                <Truck className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                <span>
                  Once confirmed, we will <strong>arrange delivery</strong> at a time convenient for you.
                </span>
              </li>
              <li className="flex items-start">
                <Package className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                <span>
                  <strong>Payment on Delivery</strong> — Our team will confirm the price when they contact you. No payment is needed now.
                </span>
              </li>
            </ul>
          </div>

          {/* POD Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 text-green-800 text-sm font-medium">
            Payment on Delivery — Our team will confirm the price when they contact you.
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status:</span>
                <span className="font-medium capitalize text-green-700">{orderData.status || 'Confirmed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {new Date(orderData.createdAt).toLocaleDateString('en-GH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">
                  {orderData.paymentMethod === 'cod' ? 'Payment on Delivery' :
                   orderData.paymentMethod === 'momo' ? 'Mobile Money' :
                   orderData.paymentMethod || 'Payment on Delivery'}
                </span>
              </div>
              {(orderData.subtotal > 0 || orderData.total > 0) && (
                <>
                  {orderData.subtotal > 0 && (
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">GHS {Number(orderData.subtotal).toFixed(2)}</span>
                    </div>
                  )}
                  {orderData.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium">GHS {Number(orderData.deliveryFee).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-green-700">GHS {Number(orderData.total ?? orderData.totalPrice ?? 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          {hasShippingInfo && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-green-600" />
                Delivery Information
              </h2>

              <div className="space-y-2 text-sm">
                {(shippingInfo.firstName || shippingInfo.lastName) && (
                  <p><span className="font-medium text-gray-700">Name:</span> {shippingInfo.firstName} {shippingInfo.lastName}</p>
                )}
                {shippingInfo.email && (
                  <p><span className="font-medium text-gray-700">Email:</span> {shippingInfo.email}</p>
                )}
                {(shippingInfo.phone || shippingInfo.mobileNumber) && (
                  <p><span className="font-medium text-gray-700">Phone:</span> {shippingInfo.phone || shippingInfo.mobileNumber}</p>
                )}
                {shippingInfo.address && (
                  <p><span className="font-medium text-gray-700">Address:</span> {shippingInfo.address}{shippingInfo.city ? `, ${shippingInfo.city}` : ''}</p>
                )}
                {shippingInfo.state && (
                  <p><span className="font-medium text-gray-700">Region:</span> {shippingInfo.state}{shippingInfo.zipCode ? `, ${shippingInfo.zipCode}` : ''}</p>
                )}
                {shippingInfo.country && (
                  <p><span className="font-medium text-gray-700">Country:</span> {shippingInfo.country}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
            Order Items ({orderData.items?.length || 0})
          </h2>

          {orderData.items && orderData.items.length > 0 ? (
            <div className="space-y-3">
              {orderData.items.map((item, index) => {
                const product = item.product || {};
                const itemName = item.name || product.name || 'Unknown Product';
                const itemQuantity = item.quantity || 1;
                const itemImage = item.image || product.image || '';

                return (
                  <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg bg-green-50">
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-14 h-14 object-cover rounded-lg mr-4 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3EProduct%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 bg-green-200 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center">
                        <Package className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{itemName}</h4>
                      <p className="text-sm text-gray-500">Qty: {itemQuantity}</p>
                    </div>
                    <div className="text-right">
                      {item.price > 0 ? (
                        <>
                          <p className="font-semibold text-gray-900 text-sm">GHS {(item.price * itemQuantity).toFixed(2)}</p>
                          {itemQuantity > 1 && (
                            <p className="text-xs text-gray-400">{itemQuantity} × {Number(item.price).toFixed(2)}</p>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          Price on delivery
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items in this order</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Continue</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/products')}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>

            <Link
              to="/orders"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-green-700" />
            Need help with your order?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Email us</p>
                <a href="mailto:nashmafarms@gmail.com" className="text-green-700 hover:underline text-sm">
                  nashmafarms@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Call us</p>
                <a href="tel:+233545086577" className="text-green-700 hover:underline text-sm">
                  +233 54 508 6577
                </a>
                <p className="text-xs text-green-600 mt-1">Mon – Fri, 8 AM – 5 PM GMT</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleContactSupport}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Send us a message
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;

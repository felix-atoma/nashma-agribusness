// components/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from '../utils/toast';

const CheckoutPage = () => {
  const { placeOrder, loading, error } = useOrder();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated, initialized, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ghana'
  });

  // Initialize form with user data when user loads
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Redirect to login if not authenticated after auth is initialized
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      toast.error('Please log in to continue with checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [initialized, isAuthenticated, navigate]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    
    const missingFields = required.filter(field => {
      const value = shippingAddress[field];
      return !value || value.toString().trim() === '';
    });
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const verifyPayment = async (reference) => {
    try {
      setIsProcessingPayment(true);
      
      // Verify payment with your backend - use the correct API URL
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/payment/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cart and redirect to success page
        clearCart();
        toast.success('Payment successful! Order confirmed.');
        
        // Redirect to success page
        navigate('/order-success', { 
          state: { 
            order: result.data.order,
            paymentMethod: paymentMethod
          } 
        });
      } else {
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to place an order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    const validation = validateForm();
    if (!validation.isValid) {
      toast.error(`Please fill in all required fields: ${validation.missingFields.join(', ')}`);
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Create a clean copy of shipping address data
      const cleanShippingAddress = {
        firstName: shippingAddress.firstName.trim(),
        lastName: shippingAddress.lastName.trim(),
        email: shippingAddress.email.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zipCode: shippingAddress.zipCode.trim(),
        country: shippingAddress.country.trim()
      };

      // Prepare order items with complete product information
      const orderItems = cart.items.map(item => ({
        product: item.product?._id || item.productId,
        productId: item.product?._id || item.productId,
        quantity: item.quantity,
        price: item.priceAtAddition || item.product?.price || 0,
        name: item.product?.name || 'Unknown Product',
        image: item.product?.image || '/placeholder-image.jpg'
      }));

      const orderData = {
        items: orderItems,
        totalPrice: cart.total,
        subtotal: cart.subtotal,
        discount: cart.discount || 0,
        paymentMethod: paymentMethod,
        shippingAddress: cleanShippingAddress,
        userId: user._id || user.id
      };

      console.log('Sending order data:', orderData);

      const orderResponse = await placeOrder(orderData);
      
      // If Paystack payment is required, redirect to payment URL
      if (orderResponse.paymentRequired && orderResponse.paymentUrl) {
        setIsProcessingPayment(true);
        toast.info('Redirecting to payment gateway...');
        
        // Redirect to Paystack payment page
        window.location.href = orderResponse.paymentUrl;
        return;
      }
      
      // For cash on delivery, clear cart and redirect to success
      clearCart();
      toast.success('Order placed successfully!');
      
      // Redirect to success page with complete order data
      navigate('/order-success', { 
        state: { 
          order: {
            ...orderResponse.data.order,
            items: orderItems,
            total: cart.total,
            subtotal: cart.subtotal,
            shippingAddress: cleanShippingAddress,
            paymentMethod: paymentMethod
          }
        } 
      });

    } catch (err) {
      console.error('Failed to place order:', err);
      if (err.message.includes('not authenticated')) {
        toast.error('Please log in to place an order');
        navigate('/login', { state: { from: '/checkout' } });
      } else if (err.message.includes('required')) {
        toast.error('Please check that all required fields are filled correctly');
      } else {
        toast.error(err.message || 'Failed to place order. Please try again.');
      }
    }
  };

  // Handle payment callback when returning from Paystack
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const trxref = urlParams.get('trxref');
    
    if (reference || trxref) {
      const paymentRef = reference || trxref;
      verifyPayment(paymentRef);
    }
  }, []);

  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validation = validateForm();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your first name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                      shippingAddress.firstName.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your last name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                      shippingAddress.lastName.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                    shippingAddress.email.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                    shippingAddress.phone.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your address"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                    shippingAddress.address.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your city"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                      shippingAddress.city.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your state"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                      shippingAddress.state.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your ZIP code"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                      shippingAddress.zipCode.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your country"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10 ${
                      shippingAddress.country.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cart.items?.map(item => (
                  <div key={item._id || item.product._id} className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.image || '/placeholder-image.jpg'}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e.target.dataset.fallback !== 'true') {
                            e.target.src = '/placeholder-image.jpg';
                            e.target.dataset.fallback = 'true';
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || 'Unnamed Product'}
                      </h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${item.product?.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>${cart.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h4>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all relative z-10"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="momo">Pay with Paystack (Card/Mobile Money)</option>
                </select>
                
                {paymentMethod === 'momo' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      You will be redirected to Paystack to complete your payment securely.
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handlePlaceOrder} 
                disabled={loading || isProcessingPayment || !cart.items || cart.items.length === 0 || !validation.isValid}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative z-10"
              >
                {isProcessingPayment ? 'Processing Payment...' : 
                 loading ? 'Placing Order...' : 
                 paymentMethod === 'momo' ? 'Proceed to Payment' : 'Place Order'}
              </button>
              
              {isProcessingPayment && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Please complete your payment in the popup window...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
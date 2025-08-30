// components/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from '../utils/toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { placeOrder, loading, error } = useOrder();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated, initialized, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
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
      
      // Clear cart after successful order
      clearCart();
      
      toast.success('Order placed successfully!');
      
      // Create complete order object for success page
      const completeOrder = {
        ...orderResponse,
        items: orderItems,
        total: cart.total,
        subtotal: cart.subtotal,
        shippingAddress: cleanShippingAddress,
        paymentMethod: paymentMethod
      };

      // Redirect to success page with complete order data
      navigate('/order-success', { 
        state: { order: completeOrder } 
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

  if (!initialized || authLoading) {
    return (
      <div className="checkout-container">
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="checkout-container">
        <div className="loading-message">Redirecting to login...</div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  const validation = validateForm();

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      <div className="checkout-content">
        <div className="shipping-form">
          <h3>Shipping Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={shippingAddress.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter your first name"
                className={shippingAddress.firstName.trim() === '' ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={shippingAddress.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter your last name"
                className={shippingAddress.lastName.trim() === '' ? 'error' : ''}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={shippingAddress.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className={shippingAddress.email.trim() === '' ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
              className={shippingAddress.phone.trim() === '' ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleInputChange}
              required
              placeholder="Enter your address"
              className={shippingAddress.address.trim() === '' ? 'error' : ''}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                required
                placeholder="Enter your city"
                className={shippingAddress.city.trim() === '' ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label>State/Province *</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                required
                placeholder="Enter your state"
                className={shippingAddress.state.trim() === '' ? 'error' : ''}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>ZIP/Postal Code *</label>
              <input
                type="text"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleInputChange}
                required
                placeholder="Enter your ZIP code"
                className={shippingAddress.zipCode.trim() === '' ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                required
                placeholder="Enter your country"
                className={shippingAddress.country.trim() === '' ? 'error' : ''}
              />
            </div>
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-content">
            {cart.items?.map(item => (
              <div key={item._id || item.product._id} className="order-item">
                <img
                  src={item.product?.image || '/placeholder-image.jpg'}
                  alt={item.product?.name || 'Product'}
                  onError={(e) => {
                    if (e.target.dataset.fallback !== 'true') {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.dataset.fallback = 'true';
                    }
                  }}
                />
                <div className="item-details">
                  <h4>{item.product?.name || 'Unnamed Product'}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            ))}
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="price-row">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>${cart.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            
            <div className="payment-method">
              <h4>Payment Method</h4>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="momo">Mobile Money</option>
              </select>
            </div>
            
            <button 
              onClick={handlePlaceOrder} 
              disabled={loading || !cart.items || cart.items.length === 0 || !validation.isValid}
              className="place-order-btn"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
// components/OrderSuccessPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { cart } = useCart();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const locationOrder = location.state?.order;
    
    if (locationOrder) {
      setOrder(locationOrder);
      setIsLoading(false);
    } else if (orders && orders.length > 0) {
      setOrder(orders[0]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [location.state, orders, cart]);

  if (isLoading) {
    return (
      <div className="order-success-container">
        <div className="order-success-content">
          <div className="loading-spinner"></div>
          <h2>Loading order details...</h2>
        </div>
      </div>
    );
  }

  const orderData = order || {
    _id: 'pending',
    total: cart?.total || 0,
    subtotal: cart?.subtotal || 0,
    status: 'pending',
    paymentMethod: 'cod',
    items: cart?.items || [],
    shippingAddress: location.state?.shippingAddress || {}
  };

  const shippingInfo = orderData.shippingAddress || {};
  const hasShippingInfo = Object.values(shippingInfo).some(val => val && val.toString().trim() !== '');
  const orderId = orderData._id || orderData.id;
  const shortOrderId = orderId && orderId !== 'pending' ? orderId.slice(-8).toUpperCase() : 'Processing...';

  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-number">Order #: {shortOrderId}</p>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="detail-row">
              <span>Subtotal:</span>
              <span>${orderData.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <span>${orderData.total?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="detail-row">
              <span>Payment Method:</span>
              <span className="capitalize">
                {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                 orderData.paymentMethod === 'momo' ? 'Mobile Money' : 
                 orderData.paymentMethod}
              </span>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className={`status-badge ${orderData.status}`}>
                {orderData.status}
              </span>
            </div>
          </div>
        </div>

        {hasShippingInfo && (
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <div className="shipping-details">
              <p><strong>Name:</strong> {shippingInfo.firstName} {shippingInfo.lastName}</p>
              <p><strong>Email:</strong> {shippingInfo.email}</p>
              <p><strong>Phone:</strong> {shippingInfo.phone || shippingInfo.mobileNumber}</p>
              <p><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
              <p><strong>Country:</strong> {shippingInfo.country}</p>
            </div>
          </div>
        )}

        <div className="order-items">
          <h3>Order Items ({orderData.items?.length || 0})</h3>
          {orderData.items && orderData.items.length > 0 ? (
            orderData.items.map((item, index) => {
              const product = item.product || {};
              const itemName = item.name || product.name || 'Unknown Product';
              const itemPrice = item.price || product.price || 0;
              const itemQuantity = item.quantity || 1;
              const itemImage = item.image || product.image || '/placeholder-image.jpg';
              const itemSubtotal = itemPrice * itemQuantity;

              return (
                <div key={index} className="order-item">
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="item-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="item-info">
                    <h4>{itemName}</h4>
                    <p>Quantity: {itemQuantity}</p>
                    <p>Price: ${itemPrice.toFixed(2)}</p>
                    <p>Subtotal: ${itemSubtotal.toFixed(2)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-items">No items in this order</p>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Continue Shopping
          </button>
          <Link to="/orders" className="btn-primary">
            View All Orders
          </Link>
          <button onClick={() => window.print()} className="btn-outline">
            Print Receipt
          </button>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📧 You will receive an email confirmation shortly</li>
            <li>📦 Your order will be processed within 24 hours</li>
            {orderData.paymentMethod === 'cod' && (
              <li>💵 Please have cash ready for delivery</li>
            )}
            <li>📱 We'll send SMS updates about your order status</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
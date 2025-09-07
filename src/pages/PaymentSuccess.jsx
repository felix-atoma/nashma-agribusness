// components/PaymentSuccess.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';
import './PaymentSuccess.css'; // Optional CSS file

const PaymentSuccess = () => {
  const [status, setStatus] = useState('verifying');
  const [order, setOrder] = useState(null);
  const { reference } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('error');
        toast.error('No payment reference provided');
        return;
      }

      try {
        setStatus('verifying');
        
        // Verify payment with your backend API
        const response = await fetch(`/api/payment/verify/${reference}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setStatus('success');
          setOrder(result.data.order);
          
          // Show success message
          toast.success('Payment verified successfully!');
          
          // Redirect to order success page after 3 seconds
          setTimeout(() => {
            navigate('/order-success', { 
              state: { 
                order: result.data.order,
                paymentMethod: 'paystack'
              } 
            });
          }, 3000);
        } else {
          setStatus('failed');
          toast.error(result.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        toast.error('Failed to verify payment. Please contact support.');
        
        // If we have order data from location state (fallback)
        if (location.state?.order) {
          setTimeout(() => {
            navigate('/order-success', { state: { order: location.state.order } });
          }, 3000);
        }
      }
    };

    // If we already have order data from redirect (Paystack callback), use it directly
    if (location.state?.order) {
      setStatus('success');
      setOrder(location.state.order);
      setTimeout(() => {
        navigate('/order-success', { state: { order: location.state.order } });
      }, 3000);
    } else if (reference) {
      verifyPayment();
    } else {
      setStatus('error');
      toast.error('Invalid payment reference');
    }
  }, [reference, navigate, location.state, user]);

  // Handle manual retry
  const handleRetry = () => {
    if (reference) {
      setStatus('verifying');
      verifyPayment();
    } else {
      navigate('/checkout');
    }
  };

  // Handle contact support
  const handleContactSupport = () => {
    // You can implement a contact form or redirect to support page
    window.open('mailto:support@nashmafarms.com', '_blank');
  };

  return (
    <div className="payment-success-container">
      <div className="payment-status-card">
        {status === 'verifying' && (
          <div className="verifying-state">
            <div className="spinner"></div>
            <h2>Verifying Your Payment</h2>
            <p>Please wait while we confirm your payment details...</p>
            <p className="reference">Reference: {reference}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been confirmed and is being processed.</p>
            {order && (
              <div className="order-details">
                <p><strong>Order ID:</strong> {order.orderNumber}</p>
                <p><strong>Amount:</strong> ${order.total?.toFixed(2)}</p>
              </div>
            )}
            <p className="redirect-message">Redirecting to order details...</p>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="failed-state">
            <div className="failed-icon">✗</div>
            <h2>Payment Failed</h2>
            <p>We couldn't verify your payment. This could be due to:</p>
            <ul>
              <li>Payment was not completed</li>
              <li>Network issues</li>
              <li>Payment was declined</li>
            </ul>
            <div className="action-buttons">
              <button onClick={handleRetry} className="retry-btn">
                Try Again
              </button>
              <button onClick={handleContactSupport} className="support-btn">
                Contact Support
              </button>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="error-state">
            <div className="error-icon">!</div>
            <h2>Verification Error</h2>
            <p>We encountered an error while verifying your payment.</p>
            <div className="action-buttons">
              <button onClick={() => navigate('/orders')} className="orders-btn">
                View My Orders
              </button>
              <button onClick={handleContactSupport} className="support-btn">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
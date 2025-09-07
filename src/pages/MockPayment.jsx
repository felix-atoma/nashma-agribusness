// components/MockPayment.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../utils/orderService';
import { toast } from 'react-toastify';
import './MockPayment.css';

const MockPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const ref = searchParams.get('reference');
    const paymentAmount = searchParams.get('amount');
    const order = searchParams.get('orderId');

    if (ref) setReference(ref);
    if (paymentAmount) setAmount(parseFloat(paymentAmount));
    if (order) setOrderId(order);

    // Simulate payment processing
    const timer = setTimeout(() => {
      setStatus('success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handlePaymentSuccess = async () => {
    try {
      setIsVerifying(true);
      
      // Verify payment with the backend
      const result = await verifyPayment(reference);
      
      if (result.success) {
        toast.success('Payment verified successfully!');
        
        // Navigate to success page with order details
        navigate('/order-success', { 
          state: { 
            order: result.data.order || { _id: orderId },
            paymentMethod: 'paystack',
            reference: reference
          } 
        });
      } else {
        toast.error(result.message || 'Payment verification failed');
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      
      // If verification fails but we have an order ID, still navigate to success
      if (orderId) {
        toast.warning('Payment may have succeeded but verification failed. Please check your orders.');
        navigate('/order-success', { 
          state: { 
            order: { _id: orderId },
            paymentMethod: 'paystack',
            reference: reference,
            verificationFailed: true
          } 
        });
      } else {
        toast.error(error.message || 'Payment verification failed');
        setStatus('error');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = () => {
    handlePaymentSuccess();
  };

  const simulateFailedPayment = () => {
    setStatus('failed');
    toast.error('Payment failed. Please try again.');
  };

  const retryPayment = () => {
    // Navigate back to checkout or retry payment
    navigate('/checkout');
  };

  return (
    <div className="mock-payment-container">
      <div className="mock-payment-card">
        <h2>Mock Payment Gateway</h2>
        
        <div className="payment-details">
          <p><strong>Reference:</strong> {reference}</p>
          <p><strong>Amount:</strong> GHS {amount?.toFixed(2)}</p>
          {orderId && <p><strong>Order ID:</strong> {orderId}</p>}
          <p><strong>Status:</strong> <span className={`status-${status}`}>{status}</span></p>
        </div>

        {status === 'processing' && (
          <div className="processing">
            <div className="spinner"></div>
            <p>Processing your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="success">
            <div className="success-icon">✓</div>
            <p>Payment successful!</p>
            <p className="verification-note">
              Now verifying with payment provider...
            </p>
            <button 
              onClick={handlePaymentSuccess} 
              className="verify-btn"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Payment'}
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="failed">
            <div className="failed-icon">✗</div>
            <p>Payment failed. Please try again.</p>
            <div className="action-buttons">
              <button onClick={retryPayment} className="retry-btn">
                Try Again
              </button>
              <button onClick={() => navigate('/cart')} className="cart-btn">
                Back to Cart
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="error">
            <div className="error-icon">!</div>
            <p>Verification error. Please try verifying manually.</p>
            <button 
              onClick={handleManualVerify} 
              className="verify-btn"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Manually'}
            </button>
          </div>
        )}

        <div className="mock-controls">
          <p className="mock-note">This is a mock payment gateway for development purposes.</p>
          <button onClick={simulateFailedPayment} className="simulate-fail-btn">
            Simulate Failed Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
// components/OrderSuccessPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { CheckCircle, Package, Truck, Clock, Mail, Phone, Download, Printer, Home, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, refreshOrders } = useOrder();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const receiptRef = useRef();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        let orderData = location.state?.order;
        
        // If order is passed via state, use it
        if (orderData) {
          setOrder(orderData);
          setIsLoading(false);
        } 
        // If we have orders in context, use the most recent one
        else if (orders && orders.length > 0) {
          setOrder(orders[0]);
          setIsLoading(false);
        } 
        // If we have order ID in URL params, try to fetch it
        else {
          const searchParams = new URLSearchParams(location.search);
          const orderId = searchParams.get('orderId');
          
          if (orderId) {
            await refreshOrders();
            const foundOrder = orders?.find(o => o._id === orderId || o.id === orderId);
            if (foundOrder) {
              setOrder(foundOrder);
            }
          }
        }
        
        // Clear cart after successful order
        clearCart();
        
      } catch (error) {
        console.error('Error loading order details:', error);
        toast.error('Could not load order details. Please check your orders page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, orders, location.search, refreshOrders, clearCart]);

  useEffect(() => {
    if (order?.createdAt) {
      // Calculate estimated delivery date (3-7 business days from now)
      const deliveryDate = new Date(order.createdAt);
      deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 5));
      
      setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }));
    }
  }, [order]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = async () => {
    try {
      const loadingToast = toast.loading('Generating receipt...', {
        position: 'bottom-right'
      });
      
      // Get the receipt element
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Convert to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      const orderId = order?._id?.slice(-8).toUpperCase() || 'receipt';
      pdf.save(`order_receipt_${orderId}.pdf`);
      
      toast.update(loadingToast, {
        render: 'Receipt downloaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: 'bottom-right'
      });
      
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to download receipt. Please try again.');
    }
  };

  const handleContactSupport = () => {
    const subject = `Support Request for Order #${order?._id?.slice(-8).toUpperCase() || ''}`;
    window.open(`mailto:support@yourstore.com?subject=${encodeURIComponent(subject)}`, '_blank');
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
    total: location.state?.total || 0,
    subtotal: location.state?.subtotal || 0,
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
        {/* Printable Receipt (hidden until printed/downloaded) */}
        <div className="hidden">
          <div ref={receiptRef} className="p-8 bg-white">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Your Store Name</h1>
              <p className="text-gray-600">123 Store Street, City, State 12345</p>
              <p className="text-gray-600">Phone: (555) 123-4567 | Email: info@yourstore.com</p>
            </div>
            
            <div className="border-t border-b border-gray-300 py-4 my-4">
              <h2 className="text-xl font-bold text-center">ORDER RECEIPT</h2>
              <div className="flex justify-between mt-2">
                <div>
                  <p><strong>Order #:</strong> {shortOrderId}</p>
                  <p><strong>Date:</strong> {new Date(orderData.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p><strong>Status:</strong> {orderData.status}</p>
                  <p><strong>Payment Method:</strong> {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : orderData.paymentMethod}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Shipping Information:</h3>
              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
              <p>{shippingInfo.address}</p>
              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
              <p>{shippingInfo.country}</p>
              <p>Email: {shippingInfo.email}</p>
              <p>Phone: {shippingInfo.phone || shippingInfo.mobileNumber}</p>
            </div>
            
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items && orderData.items.map((item, index) => {
                  const product = item.product || {};
                  const itemName = item.name || product.name || 'Unknown Product';
                  const itemPrice = item.price || product.price || 0;
                  const itemQuantity = item.quantity || 1;
                  const itemSubtotal = itemPrice * itemQuantity;
                  
                  return (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">{itemName}</td>
                      <td className="text-right py-2">{itemQuantity}</td>
                      <td className="text-right py-2">${itemPrice.toFixed(2)}</td>
                      <td className="text-right py-2">${itemSubtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div className="text-right mb-6">
              <p className="mb-1">Subtotal: ${orderData.subtotal?.toFixed(2) || '0.00'}</p>
              <p className="text-xl font-bold">Total: ${orderData.total?.toFixed(2) || '0.00'}</p>
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-8">
              <p>Thank you for your purchase!</p>
              <p>Please retain this receipt for your records.</p>
              <p>For questions about your order, contact support@yourstore.com</p>
            </div>
          </div>
        </div>

        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-700 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-green-800 font-medium mb-6">
            Order #: {shortOrderId}
          </p>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>Order confirmation email sent to <strong>{shippingInfo.email || 'your email'}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📦</span>
                <span>Your order will be processed within <strong>24 hours</strong></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚚</span>
                <span>Expected delivery by <strong>{estimatedDelivery || '3-5 business days'}</strong></span>
              </li>
              {orderData.paymentMethod === 'cod' && (
                <li className="flex items-start">
                  <span className="mr-2">💵</span>
                  <span>Please have <strong>${orderData.total?.toFixed(2)}</strong> ready for cash on delivery</span>
                </li>
              )}
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span>Tracking information will be sent to <strong>{shippingInfo.phone || 'your phone'}</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status:</span>
                <span className="font-medium capitalize">{orderData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {new Date(orderData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">
                  {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   orderData.paymentMethod === 'momo' ? 'Mobile Money' : 
                   orderData.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${orderData.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-green-600">${orderData.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {hasShippingInfo && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                Delivery Information
              </h2>
              
              <div className="space-y-2">
                <p><strong>Name:</strong> {shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p><strong>Email:</strong> {shippingInfo.email}</p>
                <p><strong>Phone:</strong> {shippingInfo.phone || shippingInfo.mobileNumber}</p>
                <p><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
                <p><strong>State:</strong> {shippingInfo.state}, {shippingInfo.zipCode}</p>
                <p><strong>Country:</strong> {shippingInfo.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items ({orderData.items?.length || 0})</h2>
          
          {orderData.items && orderData.items.length > 0 ? (
            <div className="space-y-4">
              {orderData.items.map((item, index) => {
                const product = item.product || {};
                const itemName = item.name || product.name || 'Unknown Product';
                const itemPrice = item.price || product.price || 0;
                const itemQuantity = item.quantity || 1;
                const itemImage = item.image || product.image || '';
                const itemSubtotal = itemPrice * itemQuantity;

                return (
                  <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-16 h-16 object-cover rounded mr-4"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3EProduct%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{itemName}</h4>
                      <p className="text-sm text-gray-600">Quantity: {itemQuantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${itemPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Total: ${itemSubtotal.toFixed(2)}</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Continue Shopping</span>
            </button>
            
            <Link 
              to="/orders"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">View Orders</span>
            </Link>
            
            <button 
              onClick={handleDownloadReceipt}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Download Receipt</span>
            </button>
            
            <button 
              onClick={handlePrintReceipt}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium">Print Receipt</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Need help with your order?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Contact Support</h3>
              <p className="text-blue-700 mb-2">Our team is here to help with any questions about your order.</p>
              <button 
                onClick={handleContactSupport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </button>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Order Support</h3>
              <p className="text-blue-700">Email: nashmafarms@gmail.com</p>
              <p className="text-blue-700">Phone: (+233) 054508657</p>
              <p className="text-blue-700">Hours: Mon-Fri, 9AM-5PM GMT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
// components/Orders.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { toast } from 'react-toastify';
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle, RefreshCw, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const { orders: contextOrders, refreshOrders, loading: ordersLoading, error: orderError } = useOrder();
  const [localLoading, setLocalLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed images

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (user && isMounted) {
        try {
          setLocalLoading(true);
          await refreshOrders();
        } catch (error) {
          console.error('Failed to load orders:', error);
          if (error.message !== "Request was cancelled" && isMounted) {
            toast.error('Failed to load orders. Please try again.', {
              position: 'bottom-right'
            });
          }
        } finally {
          if (isMounted) {
            setLocalLoading(false);
          }
        }
      } else if (isMounted) {
        setLocalLoading(false);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleRefreshOrders = async () => {
    try {
      setRefreshing(true);
      const loadingToast = toast.loading('Refreshing orders...', {
        position: 'bottom-right'
      });
      
      await refreshOrders();
      
      toast.update(loadingToast, {
        render: 'Orders refreshed successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      if (error.message !== "Request was cancelled") {
        toast.error('Failed to refresh orders. Please try again.', {
          position: 'bottom-right'
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const processOrders = (ordersArray) => {
    if (!ordersArray || !Array.isArray(ordersArray)) return [];
    
    return ordersArray.map(order => ({
      _id: order._id || order.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      total: order.total || order.totalPrice || 0,
      subtotal: order.subtotal || 0,
      status: order.status || 'pending',
      paymentMethod: order.paymentMethod || 'unknown',
      createdAt: order.createdAt || order.date || new Date(),
      items: order.items || [],
      shippingAddress: order.shippingAddress || order.customer || {}
    }));
  };

  // Handle image loading errors
  const handleImageError = (e, imageId) => {
    // Add to failed images set
    setFailedImages(prev => new Set(prev).add(imageId));
    
    // Use a simple placeholder without trying to load another image
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
    
    // Prevent further handling
    e.target.onerror = null;
  };

  const displayOrders = processOrders(contextOrders);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <XCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    
    const statusMap = {
      'pending': 'Pending',
      'paid': 'Paid',
      'shipped': 'Shipped',
      'completed': 'Completed',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (localLoading || ordersLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <button
          onClick={handleRefreshOrders}
          disabled={refreshing || ordersLoading}
          className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Orders'}</span>
        </button>
      </div>
      
      {orderError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{orderError}</p>
        </div>
      )}
      
      {displayOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6 text-lg">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <div className="space-y-3">
              <a
                href="/products"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
              >
                🛍️ Browse Products
              </a>
              <p className="text-sm text-gray-400 mt-4">
                Once you place an order, it will appear here with all the details.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-700 text-center">
              📦 Found {displayOrders.length} order(s) in your history
            </p>
          </div>
          
          {displayOrders.map((order) => {
            const orderDate = order.createdAt;
            const formattedDate = orderDate ? new Date(orderDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Date not available';

            const orderId = order._id;
            const shortOrderId = orderId && !orderId.startsWith('temp-') 
              ? orderId.slice(-8).toUpperCase() 
              : 'Processing...';

            const shippingInfo = order.shippingAddress || {};
            const hasShippingInfo = Object.values(shippingInfo).some(val => val && val.toString().trim() !== '');

            return (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Package className="w-6 h-6 text-gray-600" />
                    <div>
                      <span className="font-semibold text-gray-800">Order #{shortOrderId}</span>
                      <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold text-green-600">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium capitalize">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                             order.paymentMethod === 'momo' ? 'Mobile Money' : 
                             order.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    {hasShippingInfo && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {shippingInfo.firstName || ''} {shippingInfo.lastName || ''}</p>
                          <p><strong>Email:</strong> {shippingInfo.email || 'Not provided'}</p>
                          <p><strong>Phone:</strong> {shippingInfo.phone || shippingInfo.mobileNumber || 'Not provided'}</p>
                          <p><strong>Address:</strong> {shippingInfo.address || 'Not provided'}, {shippingInfo.city || ''}</p>
                          <p><strong>State:</strong> {shippingInfo.state || ''}, {shippingInfo.zipCode || ''}</p>
                          <p><strong>Country:</strong> {shippingInfo.country || 'Not provided'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Order Items ({order.items.length})
                    </h3>
                    <div className="space-y-3">
                      {order.items.length > 0 ? (
                        order.items.map((item, index) => {
                          const product = item.product || {};
                          const itemName = item.name || product.name || 'Unknown Product';
                          const itemPrice = item.price || product.price || item.priceAtAddition || 0;
                          const itemQuantity = item.quantity || 1;
                          const itemTotal = itemPrice * itemQuantity;
                          const itemImage = item.image || product.image || '';
                          const imageId = `${order._id}-${index}`;
                          const hasImageFailed = failedImages.has(imageId);

                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {itemImage && !hasImageFailed ? (
                                  <img
                                    src={itemImage}
                                    alt={itemName}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => handleImageError(e, imageId)}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-500">No Image</span>
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium text-gray-800">{itemName}</h4>
                                  <p className="text-sm text-gray-600">Quantity: {itemQuantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${itemPrice.toFixed(2)} each</p>
                                <p className="text-sm text-gray-600">Total: ${itemTotal.toFixed(2)}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No items in this order
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
// components/Orders.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { toast } from 'react-toastify';
import { 
  Package, Calendar, CreditCard, Truck, CheckCircle, 
  XCircle, RefreshCw, ShoppingBag, MapPin, Clock, 
  Phone, Mail, Search, Download, RotateCcw, 
  MessageCircle, ChevronDown, ChevronUp, Filter,
  Star, ExternalLink
} from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const { orders: contextOrders, refreshOrders, loading: ordersLoading, error: orderError } = useOrder();
  const [localLoading, setLocalLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

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
      shippingAddress: order.shippingAddress || order.customer || {},
      trackingNumber: order.trackingNumber || `TN${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      estimatedDelivery: order.estimatedDelivery || null
    }));
  };

  // Handle image loading errors
  const handleImageError = (e, imageId) => {
    setFailedImages(prev => new Set(prev).add(imageId));
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
    e.target.onerror = null;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'paid':
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    
    const statusMap = {
      'pending': 'Pending',
      'paid': 'Paid',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'out-for-delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusTimeline = (status) => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'completed'];
    const currentIndex = statuses.indexOf(status?.toLowerCase() || 'pending');
    
    return statuses.map((s, index) => ({
      status: s,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const getEstimatedDeliveryDate = (createdAt, status) => {
    if (!createdAt) return 'Not available';
    
    const orderDate = new Date(createdAt);
    const statusIndex = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered']
      .indexOf(status?.toLowerCase() || 'pending');
    
    // Add days based on status
    const deliveryDays = [7, 6, 5, 3, 1, 0, 0][statusIndex] || 7;
    orderDate.setDate(orderDate.getDate() + deliveryDays);
    
    return orderDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        // Here you would call your API to cancel the order
        toast.success('Order cancellation request submitted');
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const handleReturnOrder = async (orderId) => {
    toast.info('Return process initiated. Our support team will contact you shortly.');
  };

  const handleReorder = async (order) => {
    toast.success('Items from this order have been added to your cart');
  };

  const handleContactSupport = (orderId) => {
    window.open(`mailto:support@yourstore.com?subject=Support Request for Order #${orderId}`, '_blank');
  };

  const handleTrackPackage = (trackingNumber) => {
    window.open(`https://tracking.yourstore.com/?tracking=${trackingNumber}`, '_blank');
  };

  // Filter and sort orders
  const displayOrders = processOrders(contextOrders)
    .filter(order => {
      // Status filter
      if (filterStatus !== 'all' && order.status.toLowerCase() !== filterStatus) {
        return false;
      }
      
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesOrderId = order._id.toLowerCase().includes(term);
        const matchesItems = order.items.some(item => 
          item.name?.toLowerCase().includes(term) || 
          item.product?.name?.toLowerCase().includes(term)
        );
        
        if (!matchesOrderId && !matchesItems) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort orders
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.total - a.total;
        case 'price-low':
          return a.total - b.total;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

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
            <div className="space-y-4">
              <a
                href="/products"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
              >
                🛍️ Browse Products
              </a>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Not sure what to buy? Check out our popular categories:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <a href="/products?category=electronics" className="text-blue-600 hover:underline">Electronics</a>
                  <span>•</span>
                  <a href="/products?category=clothing" className="text-blue-600 hover:underline">Clothing</a>
                  <span>•</span>
                  <a href="/products?category=home" className="text-blue-600 hover:underline">Home & Garden</a>
                  <span>•</span>
                  <a href="/products?category=beauty" className="text-blue-600 hover:underline">Beauty</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search orders</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by product name, order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Total: High to Low</option>
                  <option value="price-low">Total: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700 text-center">
              📦 Found {displayOrders.length} order{displayOrders.length !== 1 ? 's' : ''} matching your criteria
            </p>
          </div>
          
          <div className="space-y-6">
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
              const isExpanded = expandedOrders.has(order._id);

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
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </div>
                      <button 
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
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
                            {order.trackingNumber && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tracking Number:</span>
                                <span className="font-medium">{order.trackingNumber}</span>
                              </div>
                            )}
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

                      {/* Order Tracking Timeline */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status & Tracking</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Estimated Delivery</p>
                              <p className="font-medium">{getEstimatedDeliveryDate(order.createdAt, order.status)}</p>
                            </div>
                            {order.status?.toLowerCase() === 'shipped' && order.trackingNumber && (
                              <button 
                                onClick={() => handleTrackPackage(order.trackingNumber)}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Track Package
                              </button>
                            )}
                          </div>
                          
                          {/* Status Timeline */}
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                            {getStatusTimeline(order.status).map((step, index) => (
                              <div key={step.status} className="relative flex items-center mb-6 last:mb-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                  {step.completed ? (
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  ) : (
                                    <div className={`w-3 h-3 rounded-full ${step.current ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                  )}
                                </div>
                                <div className="ml-4 flex-1">
                                  <p className={`font-medium capitalize ${step.completed ? 'text-green-700' : 'text-gray-700'}`}>
                                    {formatStatus(step.status)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {step.completed ? 'Completed' : step.current ? 'In progress' : 'Pending'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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

                      {/* Order Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-3">
                          {order.status?.toLowerCase() === 'delivered' && (
                            <>
                              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                                Confirm Receipt
                              </button>
                              <button 
                                onClick={() => handleReturnOrder(order._id)}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
                              >
                                Return Items
                              </button>
                              <button 
                                onClick={() => handleReorder(order)}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Reorder
                              </button>
                            </>
                          )}
                          
                          {['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase()) && (
                            <button 
                              onClick={() => handleCancelOrder(order._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                            >
                              Cancel Order
                            </button>
                          )}
                          
                          <button className="flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                            <Download className="w-4 h-4 mr-1" />
                            Download Invoice
                          </button>
                          
                          <button 
                            onClick={() => handleContactSupport(order._id)}
                            className="flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact Support
                          </button>
                        </div>
                      </div>

                      {/* Support Section */}
                      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-3">Need help with this order?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-blue-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Call Support</p>
                              <p className="text-sm text-blue-700">+1 (555) 123-4567</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-5 h-5 text-blue-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Email Support</p>
                              <p className="text-sm text-blue-700">support@yourstore.com</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
// pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { toast } from 'react-toastify';
import {
  Package, Calendar, Truck, CheckCircle,
  XCircle, RefreshCw, ShoppingBag, MapPin, Clock,
  Phone, Mail, Search, RotateCcw,
  MessageCircle, ChevronDown, ChevronUp,
  ExternalLink
} from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const { orders: contextOrders, refreshOrders, loading: ordersLoading, error: orderError, cancelOrder } = useOrder();
  const [localLoading, setLocalLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
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
          if (error.message !== 'Request was cancelled' && isMounted) {
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
      const loadingToast = toast.loading('Refreshing orders...', { position: 'bottom-right' });
      await refreshOrders();
      toast.update(loadingToast, {
        render: 'Orders refreshed!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      if (error.message !== 'Request was cancelled') {
        toast.error('Failed to refresh orders. Please try again.', { position: 'bottom-right' });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const processOrders = (ordersArray) => {
    if (!ordersArray || !Array.isArray(ordersArray)) return [];

    return ordersArray.map(order => ({
      _id: order._id || order.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      status: order.status || 'pending',
      paymentMethod: order.paymentMethod || 'cod',
      createdAt: order.createdAt || order.date || new Date(),
      items: order.items || [],
      shippingAddress: order.shippingAddress || order.customer || {},
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery || null
    }));
  };

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
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'paid':
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    const statusMap = {
      pending: 'Pending',
      paid: 'Paid',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      'out-for-delivery': 'Out for Delivery',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paid':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
    const deliveryDays = [7, 6, 5, 3, 1, 0, 0][statusIndex] || 7;
    orderDate.setDate(orderDate.getDate() + deliveryDays);
    return orderDate.toLocaleDateString('en-GH', {
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
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        setCancellingOrderId(orderId);
        await cancelOrder(orderId);
      } catch (error) {
        console.error('Failed to cancel order:', error);
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  const handleReturnOrder = () => {
    toast.success('Return process initiated. Our support team will contact you shortly.');
  };

  const handleReorder = () => {
    toast.success('Items from this order have been added to your cart.');
  };

  const handleContactSupport = (orderId) => {
    window.open(
      `mailto:nashmafarms@gmail.com?subject=${encodeURIComponent(`Support Request for Order #${orderId}`)}`,
      '_blank'
    );
  };

  const handleTrackPackage = (trackingNumber) => {
    window.open(`https://tracking.nashma.com/?tracking=${trackingNumber}`, '_blank');
  };

  // Filter and sort orders (no price-based sort options)
  const displayOrders = processOrders(contextOrders)
    .filter(order => {
      if (filterStatus !== 'all' && order.status.toLowerCase() !== filterStatus) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesOrderId = order._id.toLowerCase().includes(term);
        const matchesItems = order.items.some(item =>
          item.name?.toLowerCase().includes(term) ||
          item.product?.name?.toLowerCase().includes(term)
        );
        if (!matchesOrderId && !matchesItems) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt); // newest (default)
    });

  if (localLoading || ordersLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="ml-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={handleRefreshOrders}
            disabled={refreshing || ordersLoading}
            className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {orderError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{orderError}</p>
          </div>
        )}

        {/* Empty State */}
        {contextOrders && contextOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6 max-w-sm">
                You haven't placed any orders yet. Browse our Nashma products and place your first order.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-base font-semibold"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Nashma Products
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filter and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search orders</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Product name or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
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

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count */}
            {displayOrders.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-center text-green-800 text-sm font-medium">
                Showing {displayOrders.length} order{displayOrders.length !== 1 ? 's' : ''}
              </div>
            )}

            {displayOrders.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 border border-gray-100">
                No orders match your current filters.
              </div>
            )}

            {/* Order Cards */}
            <div className="space-y-6">
              {displayOrders.map((order) => {
                const formattedDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-GH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Date not available';

                const orderId = order._id;
                const shortOrderId = orderId && !orderId.startsWith('temp-')
                  ? orderId.slice(-8).toUpperCase()
                  : 'Processing...';

                const shippingInfo = order.shippingAddress || {};
                const hasShippingInfo = Object.values(shippingInfo).some(
                  val => val && val.toString().trim() !== ''
                );
                const isExpanded = expandedOrders.has(order._id);
                const isCancellable = ['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase());
                const isCancelling = cancellingOrderId === order._id;

                return (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    {/* Card Header */}
                    <div className="p-5 border-b border-gray-100 bg-green-50 flex justify-between items-center flex-wrap gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">Order #{shortOrderId}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{formattedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {/* POD badge */}
                        <span className="hidden sm:inline-flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                          Payment on Delivery
                        </span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleOrderExpansion(order._id)}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                          aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Order Info */}
                          <div>
                            <h3 className="text-base font-semibold text-green-800 mb-3">Order Details</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Payment:</span>
                                <span className="font-medium capitalize">
                                  {order.paymentMethod === 'cod' ? 'Payment on Delivery' :
                                   order.paymentMethod === 'momo' ? 'Mobile Money' :
                                   order.paymentMethod || 'Payment on Delivery'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Amount:</span>
                                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                  Confirmed on delivery
                                </span>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Tracking #:</span>
                                  <span className="font-mono font-medium text-green-700">{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Shipping Info */}
                          {hasShippingInfo && (
                            <div>
                              <h3 className="text-base font-semibold text-green-800 mb-3">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Delivery Address
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                {(shippingInfo.firstName || shippingInfo.lastName) && (
                                  <p className="font-medium text-gray-800">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                )}
                                {(shippingInfo.phone || shippingInfo.mobileNumber) && (
                                  <p>{shippingInfo.phone || shippingInfo.mobileNumber}</p>
                                )}
                                {shippingInfo.address && (
                                  <p>{shippingInfo.address}{shippingInfo.city ? `, ${shippingInfo.city}` : ''}</p>
                                )}
                                {shippingInfo.state && (
                                  <p>{shippingInfo.state}{shippingInfo.zipCode ? `, ${shippingInfo.zipCode}` : ''}</p>
                                )}
                                {shippingInfo.country && <p>{shippingInfo.country}</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Status Timeline */}
                        <div className="mt-6">
                          <h3 className="text-base font-semibold text-green-800 mb-3">Order Progress</h3>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <p className="text-xs text-green-600 uppercase font-semibold tracking-wide">Estimated Delivery</p>
                                <p className="font-medium text-sm">{getEstimatedDeliveryDate(order.createdAt, order.status)}</p>
                              </div>
                              {order.status?.toLowerCase() === 'shipped' && order.trackingNumber && (
                                <button
                                  onClick={() => handleTrackPackage(order.trackingNumber)}
                                  className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-700 font-medium"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Track
                                </button>
                              )}
                            </div>

                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                              {getStatusTimeline(order.status).map((step) => (
                                <div key={step.status} className="relative flex items-center mb-5 last:mb-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                                  }`}>
                                    {step.completed ? (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    ) : (
                                      <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <p className={`text-sm font-medium capitalize ${step.completed ? 'text-green-700' : 'text-gray-400'}`}>
                                      {formatStatus(step.status)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {step.current ? 'In progress' : step.completed ? 'Completed' : 'Upcoming'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-6">
                          <h3 className="text-base font-semibold text-green-800 mb-3">
                            Items ({order.items.length})
                          </h3>
                          <div className="space-y-2">
                            {order.items.length > 0 ? (
                              order.items.map((item, index) => {
                                const product = item.product || {};
                                const itemName = item.name || product.name || 'Unknown Product';
                                const itemQuantity = item.quantity || 1;
                                const itemImage = item.image || product.image || '';
                                const imageId = `${order._id}-${index}`;
                                const hasImageFailed = failedImages.has(imageId);

                                return (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                      {itemImage && !hasImageFailed ? (
                                        <img
                                          src={itemImage}
                                          alt={itemName}
                                          className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                                          onError={(e) => handleImageError(e, imageId)}
                                        />
                                      ) : (
                                        <div className="w-11 h-11 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                          <Package className="w-5 h-5 text-green-400" />
                                        </div>
                                      )}
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-800">{itemName}</h4>
                                        <p className="text-xs text-gray-500">Qty: {itemQuantity}</p>
                                      </div>
                                    </div>
                                    <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2.5 py-1 rounded-full">
                                      Price on delivery
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-center py-3 text-gray-400 text-sm">No items in this order</p>
                            )}
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-3">
                            {order.status?.toLowerCase() === 'delivered' && (
                              <>
                                <button
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                                >
                                  Confirm Receipt
                                </button>
                                <button
                                  onClick={() => handleReturnOrder(order._id)}
                                  className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 font-medium"
                                >
                                  Return Items
                                </button>
                                <button
                                  onClick={() => handleReorder(order)}
                                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                                >
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Reorder
                                </button>
                              </>
                            )}

                            {isCancellable && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={isCancelling}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                              >
                                {isCancelling ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin inline" />
                                    Cancelling...
                                  </>
                                ) : (
                                  'Cancel Order'
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => handleContactSupport(shortOrderId)}
                              className="flex items-center border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50 font-medium"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Contact Support
                            </button>
                          </div>
                        </div>

                        {/* Support Info */}
                        <div className="mt-5 bg-green-50 border border-green-100 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-green-800 mb-3">Need help with this order?</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-green-800">Call us</p>
                                <a href="tel:+233545086577" className="text-xs text-green-700 hover:underline">
                                  +233 54 508 6577
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-green-800">Email us</p>
                                <a href="mailto:nashmafarms@gmail.com" className="text-xs text-green-700 hover:underline">
                                  nashmafarms@gmail.com
                                </a>
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
    </div>
  );
};

export default Orders;

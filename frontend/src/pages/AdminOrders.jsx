import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import { FiShoppingBag, FiSearch, FiChevronDown, FiUser, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending:   { pill: 'bg-yellow-100 text-yellow-700 border-yellow-200', btn: 'bg-yellow-500 text-white border-yellow-500' },
  confirmed: { pill: 'bg-blue-100   text-blue-700   border-blue-200',   btn: 'bg-blue-500   text-white border-blue-500' },
  shipped:   { pill: 'bg-purple-100 text-purple-700  border-purple-200', btn: 'bg-purple-500 text-white border-purple-500' },
  completed: { pill: 'bg-green-100  text-green-700   border-green-200',  btn: 'bg-green-600  text-white border-green-600' },
  cancelled: { pill: 'bg-red-100    text-red-600     border-red-200',    btn: 'bg-red-500    text-white border-red-500' },
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-GH', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Accra',
  });
}

export default function AdminOrders() {
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded,     setExpanded]     = useState(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/orders');
      return res.data?.data?.orders || [];
    },
    staleTime: 60 * 1000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      apiClient.patch(`/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.orderNumber || '').toLowerCase().includes(q) ||
      `${o.shippingAddress?.firstName} ${o.shippingAddress?.lastName}`.toLowerCase().includes(q) ||
      (o.shippingAddress?.phone || '').includes(q);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm">
        Failed to load orders.
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order #, name or phone…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all sm:w-44"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(s => {
          const count = orders.filter(o => o.status === s).length;
          const { pill } = STATUS_STYLES[s] || {};
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-all ${
                filterStatus === s
                  ? (STATUS_STYLES[s]?.btn || 'bg-gray-700 text-white border-gray-700')
                  : (pill || 'bg-gray-100 text-gray-600 border-gray-200') + ' hover:opacity-80'
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <FiShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              {search || filterStatus ? 'No orders match your filter' : 'No orders yet'}
            </p>
          </div>
        ) : (
          filtered.map(order => {
            const isOpen = expanded === order._id;
            const { pill: pillStyle } = STATUS_STYLES[order.status] || {};

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-gray-50/70 transition-colors text-left gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Order number */}
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-900 text-sm">#{order.orderNumber}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        {order.shippingAddress?.phone
                          ? <span className="hidden sm:inline"> · {order.shippingAddress.phone}</span>
                          : null}
                      </p>
                    </div>

                    {/* Status pill */}
                    <span className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${pillStyle || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-gray-400 text-xs hidden md:block">{fmt(order.createdAt)}</span>
                    <span className="text-gray-400 text-xs hidden sm:block">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </span>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 sm:px-5 py-4 space-y-5">

                    {/* Items */}
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Items Ordered</p>
                      <div className="space-y-2">
                        {(order.items || []).map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl"
                          >
                            <span className="text-sm text-gray-800 font-semibold">
                              {item.name || item.product?.name || 'Product'}
                            </span>
                            <div className="flex items-center gap-3">
                              {item.price > 0 && (
                                <span className="text-xs text-amber-700 font-semibold hidden sm:block">
                                  GHS {Number(item.price).toFixed(2)}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full font-medium">
                                ×{item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer + date */}
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Customer Details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          {
                            icon: FiUser,
                            label: 'Name',
                            value: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || '—',
                          },
                          {
                            icon: FiPhone,
                            label: 'Phone',
                            value: order.shippingAddress?.phone || '—',
                          },
                          {
                            icon: FiMail,
                            label: 'Email',
                            value: order.shippingAddress?.email || '—',
                          },
                          {
                            icon: FiCalendar,
                            label: 'Placed',
                            value: fmt(order.createdAt),
                          },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                            <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
                              <p className="text-sm text-gray-800 font-semibold truncate">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Update status */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map(s => {
                          const isActive = order.status === s;
                          const { btn, pill } = STATUS_STYLES[s] || {};
                          return (
                            <button
                              key={s}
                              onClick={() => statusMutation.mutate({ orderId: order._id, status: s })}
                              disabled={isActive || statusMutation.isPending}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border capitalize transition-all disabled:cursor-not-allowed ${
                                isActive
                                  ? btn || 'bg-gray-700 text-white border-gray-700'
                                  : (pill || 'bg-gray-100 text-gray-600 border-gray-200') + ' hover:opacity-80 disabled:opacity-40'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

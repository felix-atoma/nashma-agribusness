import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import { FiShoppingBag, FiSearch, FiChevronDown } from 'react-icons/fi';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'];

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100   text-blue-700   border-blue-200',
  shipped:   'bg-purple-100 text-purple-700  border-purple-200',
  completed: 'bg-green-100  text-green-700   border-green-200',
  cancelled: 'bg-red-100    text-red-600     border-red-200',
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
  const [search,        setSearch]        = useState('');
  const [filterStatus,  setFilterStatus]  = useState('');
  const [expanded,      setExpanded]      = useState(null);
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 text-sm">
        Failed to load orders.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
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
          className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all capitalize"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
            <FiShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {search || filterStatus ? 'No orders match your filter' : 'No orders yet'}
            </p>
          </div>
        ) : (
          filtered.map(order => {
            const isOpen = expanded === order._id;
            const statusColor = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600 border-gray-200';
            return (
              <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Order header row */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        {order.shippingAddress?.phone ? ` · ${order.shippingAddress.phone}` : ''}
                      </p>
                    </div>
                    <span className={`hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <p className="text-gray-400 text-xs hidden md:block">{fmt(order.createdAt)}</p>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items Ordered</p>
                      <div className="space-y-1.5">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                            <span className="text-sm text-gray-800 font-medium">
                              {item.name || item.product?.name || 'Product'}
                            </span>
                            <span className="text-sm text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer info */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">Name</p>
                          <p className="text-gray-800 font-medium">
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Phone</p>
                          <p className="text-gray-800 font-medium">{order.shippingAddress?.phone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Email</p>
                          <p className="text-gray-800 font-medium">{order.shippingAddress?.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Placed</p>
                          <p className="text-gray-800 font-medium">{fmt(order.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status update */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => statusMutation.mutate({ orderId: order._id, status: s })}
                            disabled={order.status === s || statusMutation.isPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              order.status === s
                                ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-current`
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
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

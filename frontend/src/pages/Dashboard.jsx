import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import {
  FiPackage, FiPlusCircle, FiShoppingBag, FiUsers,
  FiClock, FiTrendingUp, FiArrowRight,
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100   text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  completed: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-600',
};

function StatCard({ label, value, icon: Icon, bg, iconColor, link }) {
  return (
    <Link
      to={link}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-2 leading-tight">{label}</p>
          <p className="text-3xl font-extrabold text-gray-900 tabular-nums">{value}</p>
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${bg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Admin';

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await apiClient.get('/products');
      return Array.isArray(res.data) ? res.data : (res.data?.products || []);
    },
    staleTime: 2 * 60 * 1000,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/orders');
      return res.data?.data?.orders || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users');
      return res.data?.data?.users || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const pending   = orders.filter(o => o.status === 'pending').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const recentOrders = orders.slice(0, 6);

  const stats = [
    { label: 'Total Products',   value: products.length, icon: FiPackage,     bg: 'bg-green-50',  iconColor: 'text-green-600',  link: '/admin/products' },
    { label: 'Total Orders',     value: orders.length,   icon: FiShoppingBag, bg: 'bg-amber-50',  iconColor: 'text-amber-600',  link: '/admin/orders' },
    { label: 'Pending Orders',   value: pending,         icon: FiClock,       bg: 'bg-orange-50', iconColor: 'text-orange-500', link: '/admin/orders' },
    { label: 'Registered Users', value: users.length,    icon: FiUsers,       bg: 'bg-blue-50',   iconColor: 'text-blue-600',   link: '#' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Page title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Good {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin/products/create"
            className="flex items-center justify-between gap-3 bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <FiPlusCircle className="w-4 h-4 flex-shrink-0" />
              Add New Product
            </span>
            <FiArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center justify-between gap-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 text-gray-700 px-4 py-3 rounded-xl font-semibold text-sm transition-colors group"
          >
            <span className="flex items-center gap-2">
              <FiPackage className="w-4 h-4 flex-shrink-0" />
              Manage Products
            </span>
            <FiArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center justify-between gap-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 text-gray-700 px-4 py-3 rounded-xl font-semibold text-sm transition-colors group"
          >
            <span className="flex items-center gap-2">
              <FiShoppingBag className="w-4 h-4 flex-shrink-0" />
              View Orders
            </span>
            <FiArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Summary + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Mini summary */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 mb-5">
            <FaLeaf className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-bold text-green-100">Store Overview</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">Completed orders</span>
              <span className="font-bold text-white">{completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">Pending orders</span>
              <span className="font-bold text-amber-400">{pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">Total products</span>
              <span className="font-bold text-white">{products.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">Registered users</span>
              <span className="font-bold text-white">{users.length}</span>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-green-700/60">
            <div className="flex items-center gap-2 text-green-300 text-xs">
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>Sustainable impact since 2024</span>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">Recent Orders</p>
            <Link to="/admin/orders" className="text-xs text-green-700 hover:text-green-900 font-semibold flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-14 text-center">
              <FiShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 mr-3">
                    <p className="font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      {order.shippingAddress?.phone ? ` · ${order.shippingAddress.phone}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-400 text-xs hidden sm:block">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

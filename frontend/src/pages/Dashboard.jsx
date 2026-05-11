import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import { FiPackage, FiPlusCircle, FiShoppingBag, FiUsers, FiClock, FiCheckCircle } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100   text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  completed: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-700',
};

export default function Dashboard() {
  const { user } = useAuth();

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
  const confirmed = orders.filter(o => o.status === 'confirmed').length;

  const statCards = [
    { label: 'Total Products',   value: products.length, icon: FiPackage,     color: 'border-green-200  bg-green-50  text-green-700',  link: '/admin/products' },
    { label: 'Total Orders',     value: orders.length,   icon: FiShoppingBag, color: 'border-amber-200  bg-amber-50  text-amber-700',  link: '/admin/orders' },
    { label: 'Pending Orders',   value: pending,         icon: FiClock,       color: 'border-orange-200 bg-orange-50 text-orange-700', link: '/admin/orders' },
    { label: 'Registered Users', value: users.length,    icon: FiUsers,       color: 'border-blue-200   bg-blue-50   text-blue-700',   link: '#' },
  ];

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Nashma Agribusiness store</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, link }) => {
          const [border, bg, text] = color.split(' ');
          return (
            <Link
              key={label}
              to={link}
              className={`bg-white border ${border} rounded-xl p-5 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1 leading-tight">{label}</p>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${bg} ${text}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <FiPlusCircle className="w-4 h-4" />
            Add New Product
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <FiPackage className="w-4 h-4" />
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <FiShoppingBag className="w-4 h-4" />
            View Orders
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-600">Recent Orders</p>
          <Link to="/admin/orders" className="text-xs text-green-700 hover:text-green-900 font-semibold">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <FiShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      {order.shippingAddress?.phone ? ` · ${order.shippingAddress.phone}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-gray-400 text-xs hidden sm:block">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
        <FaLeaf className="w-4 h-4 flex-shrink-0" />
        <span>Nashma Agribusiness — Sustainable impact since 2024</span>
      </div>
    </div>
  );
}

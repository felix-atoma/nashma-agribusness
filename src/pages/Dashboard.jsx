import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPackage, FiPlusCircle, FiUsers, FiDollarSign, FiSettings } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="welcome-message mb-8">
        <p className="text-lg">Welcome back, <span className="font-semibold">{user?.name}</span>!</p>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard 
          title="Total Products" 
          value="124" 
          icon={<FiPackage className="text-blue-500" size={24} />}
          link="/admin/products"
        />
        <DashboardCard 
          title="New Orders" 
          value="15" 
          icon={<FiDollarSign className="text-green-500" size={24} />}
          link="#"
        />
        <DashboardCard 
          title="Registered Users" 
          value="89" 
          icon={<FiUsers className="text-purple-500" size={24} />}
          link="#"
        />
        <DashboardCard 
          title="Revenue" 
          value="$3,245" 
          icon={<FiDollarSign className="text-yellow-500" size={24} />}
          link="#"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/admin/products/create" 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <FiPlusCircle className="mr-3 text-blue-500" size={20} />
            <span>Add New Product</span>
          </Link>
          <Link 
            to="/admin/products" 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <FiPackage className="mr-3 text-green-500" size={20} />
            <span>Manage Products</span>
          </Link>
          <Link 
            to="#" 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <FiUsers className="mr-3 text-purple-500" size={20} />
            <span>Manage Users</span>
          </Link>
          <Link 
            to="#" 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
          >
            <FiSettings className="mr-3 text-yellow-500" size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            action="Created new product" 
            item="Wireless Headphones" 
            time="2 hours ago"
          />
          <ActivityItem 
            action="Updated product" 
            item="Smart Watch Series 5" 
            time="5 hours ago"
          />
          <ActivityItem 
            action="Processed order" 
            item="#ORD-45678" 
            time="1 day ago"
          />
          <ActivityItem 
            action="Added new category" 
            item="Accessories" 
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, link }) => (
  <Link 
    to={link} 
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-3 bg-gray-100 rounded-full">
        {icon}
      </div>
    </div>
  </Link>
);

// Activity Item Component
const ActivityItem = ({ action, item, time }) => (
  <div className="flex items-start">
    <div className="bg-blue-100 p-2 rounded-full mr-4">
      <FiPackage className="text-blue-500" size={16} />
    </div>
    <div>
      <p className="font-medium">
        <span className="text-gray-700">{action}: </span>
        <span className="text-blue-600">{item}</span>
      </p>
      <p className="text-gray-500 text-sm">{time}</p>
    </div>
  </div>
);

export default Dashboard;
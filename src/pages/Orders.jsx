import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setOrders([
            {
              id: 'ORD-12345',
              date: '2023-05-15',
              status: 'Delivered',
              total: 149.99,
              items: [
                { name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99 },
                { name: 'Bamboo Toothbrush Set', quantity: 1, price: 9.99 },
              ],
            },
            {
              id: 'ORD-12346',
              date: '2023-06-02',
              status: 'Shipped',
              total: 89.97,
              items: [
                { name: 'Reusable Water Bottle', quantity: 1, price: 24.99 },
                { name: 'Eco-Friendly Notebook', quantity: 3, price: 12.99 },
              ],
            },
            {
              id: 'ORD-12347',
              date: '2023-06-10',
              status: 'Processing',
              total: 34.98,
              items: [
                { name: 'Natural Soap Bar', quantity: 2, price: 5.99 },
                { name: 'Bamboo Hairbrush', quantity: 1, price: 12.99 },
              ],
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load orders');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      default:
        return <XCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <a
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Order #{order.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`text-sm font-medium ${
                    order.status === 'Delivered' ? 'text-green-600' :
                    order.status === 'Shipped' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Ordered on {new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm font-semibold">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity} × {item.name}
                        </span>
                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-gray-50 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800 mr-4">
                  Track Order
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
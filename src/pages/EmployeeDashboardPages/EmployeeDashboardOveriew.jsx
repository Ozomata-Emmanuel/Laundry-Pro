import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../../context/DataContext';
import { 
  FaShoppingBag, 
  FaCheckCircle, 
  FaClock, 
  FaSpinner,
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine
} from 'react-icons/fa';

const EmployeeDashboardOverview = () => {
  const { user } = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchEmployeeOrders(user.id);
    }
  }, [user]);

  const fetchEmployeeOrders = async (employeeId) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5002/laundry/api/orders/employee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employee orders');
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'finished').length;
    
    const completedWithTimes = orders.filter(o => 
      o.status === 'finished' && o.updatedAt && o.createdAt
    );
    
    const avgCompletionHours = completedWithTimes.length > 0
      ? completedWithTimes.reduce((sum, order) => {
          const created = new Date(order.createdAt);
          const updated = new Date(order.updatedAt);
          const hours = (updated - created) / (1000 * 60 * 60);
          return sum + hours;
        }, 0) / completedWithTimes.length
      : 0;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    const completionRate = totalOrders > 0 
      ? (completedOrders / totalOrders) * 100 
      : 0;

    return {
      totalOrders,
      processingOrders,
      completedOrders,
      recentOrders,
      avgCompletionHours: Math.round(avgCompletionHours * 10) / 10,
      completionRate: Math.round(completionRate)
    };
  };

  const stats = calculateStats();

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-3 text-lg">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 mb-8">Welcome back! Here's your current workload summary.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Assigned</p>
              <p className="text-3xl font-bold mt-1">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingBag className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.processingOrders}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completedOrders}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaShoppingBag className="mr-2 text-blue-500" />
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">#{order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user?.first_name ? `${order.user.first_name} ${order.user.last_name}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₦{order.total_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'finished' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(order.updatedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-700">
            <FaChartLine className="mr-2 text-blue-500" /> Your Performance
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completion Rate</p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold">{stats.completionRate}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Average Completion Time</p>
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-2">{stats.avgCompletionHours}</div>
                <div className="text-gray-500">hours</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Fastest Completion</p>
                <p className="font-bold">4 hours</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Avg Items/Order</p>
                <p className="font-bold">
                  {orders.length > 0 
                    ? Math.round(
                        orders.reduce(
                          (sum, order) => sum + order.items.reduce((acc, item) => acc + item.quantity, 0),
                          0
                        ) / orders.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {orders.length > 0 ? (
              [...orders]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 4)
                .map((order) => (
                  <div key={order._id} className="flex items-start pb-4 border-b border-gray-100">
                    <div className={`p-2 rounded-full mr-3 ${
                      order.status === 'finished' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status === 'finished' ? (
                        <FaCheckCircle className="text-sm" />
                      ) : (
                        <FaClock className="text-sm" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {order.status === 'finished' ? 'Completed' : 'Processed'} order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.updatedAt)} • {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardOverview;
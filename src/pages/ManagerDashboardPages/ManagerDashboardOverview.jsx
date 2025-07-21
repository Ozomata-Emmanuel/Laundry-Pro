import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../../context/DataContext';
import { 
  FaShoppingBag, 
  FaUserTie, 
  FaMoneyBillWave, 
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaTshirt
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ManagerDashboardOverview = () => {
  const { users } = useContext(DataContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEmployees: 0,
    revenue: 0,
    overdueOrders: 0,
    avgCompletionTime: 0,
    popularServices: [],
    statusData: [],
    paymentData: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const managerUser = users.manager;

  // Sample color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (managerUser?.branch) {
      fetchStats(managerUser.branch);
    }
  }, [managerUser]);

const fetchStats = async (branchId) => {
  const ManagerToken = localStorage.getItem("ManagerToken");
  
  if (!ManagerToken) {
    setError('No authentication token found');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    
    const config = {
      headers: {
        'Authorization': `Bearer ${ManagerToken}`,
        'Content-Type': 'application/json'
      }
    };

    const [ordersRes, employeesRes] = await Promise.all([
      axios.get(`http://localhost:5002/laundry/api/order/all/${branchId}`, config),
      axios.get(`http://localhost:5002/laundry/api/users/branch/${branchId}/employees`, config)
    ]);

    const orders = ordersRes.data.data || [];
    const employees = employeesRes.data.data || [];

    // Calculate additional metrics
    const paidOrders = orders.filter(o => o.is_paid);
    const unpaidOrders = orders.filter(o => !o.is_paid);
    
    // Using pickup_date as due_date since your schema doesn't have due_date
    const overdueOrders = orders.filter(o => 
      o.pickup_date && new Date(o.pickup_date) < new Date() && o.status !== 'finished'
    ).length;

    // Calculate average completion time using createdAt and updatedAt
    const completedOrders = orders.filter(o => o.status === 'finished');
    const totalCompletionTime = completedOrders.reduce((sum, order) => {
      if (order.updatedAt && order.createdAt) {
        return sum + (new Date(order.updatedAt) - new Date(order.createdAt));
      }
      return sum;
    }, 0);
    const avgCompletionTime = completedOrders.length > 0 
      ? totalCompletionTime / completedOrders.length 
      : 0;

    // Get popular items (your schema uses 'items' not 'services')
    const itemCounts = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item && item.name) {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
          }
        });
      }
    });
    const popularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setStats({
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'not_started').length,
      completedOrders: completedOrders.length,
      totalEmployees: employees.length,
      revenue: paidOrders.reduce((sum, order) => sum + (order.total_price || 0), 0),
      overdueOrders,
      avgCompletionTime: avgCompletionTime / (1000 * 60 * 60), // Convert to hours
      popularItems, // Changed from popularServices to popularItems
      statusData: [
        { name: 'Not Started', value: orders.filter(o => o.status === 'not_started').length },
        { name: 'Processing', value: orders.filter(o => o.status === 'processing').length },
        { name: 'Finished', value: completedOrders.length },
      ],
      paymentData: [
        { name: 'Paid', value: paidOrders.length },
        { name: 'Unpaid', value: unpaidOrders.length }
      ],
      deliveryStats: [ // New metric based on delivery_option
        { name: 'Pickup', value: orders.filter(o => o.delivery_option === 'pickup').length },
        { name: 'Dropoff', value: orders.filter(o => o.delivery_option === 'dropoff').length }
      ]
    });
    
    setLoading(false);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaShoppingBag size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaClock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-400 mt-1">{Math.round((stats.pendingOrders / stats.totalOrders) * 100)}% of total</p>
            </div>
          </div>
        </div>

        {/* Employees */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUserTie size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-400 mt-1">Active staff</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaMoneyBillWave size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                ₦{stats.revenue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1">From {stats.completedOrders} completed orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Completed Orders */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaCheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold">{stats.completedOrders}</p>
              <p className="text-xs text-gray-400 mt-1">{Math.round((stats.completedOrders / stats.totalOrders) * 100)}% completion rate</p>
            </div>
          </div>
        </div>

        {/* Overdue Orders */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaExclamationTriangle size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue Orders</p>
              <p className="text-2xl font-bold">{stats.overdueOrders}</p>
              <p className="text-xs text-gray-400 mt-1">Need attention</p>
            </div>
          </div>
        </div>

        {/* Avg Completion Time */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Completion</p>
              <p className="text-2xl font-bold">{stats.avgCompletionTime.toFixed(1)} hrs</p>
              <p className="text-xs text-gray-400 mt-1">Processing time</p>
            </div>
          </div>
        </div>

        {/* Popular Service */}
{/* Top Items */}
<div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
  <h3 className="text-sm text-gray-500 mb-2">Top Items</h3>
  <div className="space-y-2">
    {stats.popularItems?.length > 0 ? (
      stats.popularItems.slice(0, 3).map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="font-medium truncate">
            {index + 1}. {item.name}
          </span>
          <span className="text-gray-500">{item.count} orders</span>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No item data available</p>
    )}
  </div>
</div>
      </div>

      {/* Charts Section */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>

      {/* Popular Services */}
<div className="bg-white p-6 rounded-lg shadow mb-8">
  <h2 className="text-lg font-semibold mb-4">Top Items</h2>
  {stats.popularItems?.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.popularItems.map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <FaTshirt className="text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.count} orders</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      No item data available
    </div>
  )}
</div>
    </div>
  );
};

export default ManagerDashboardOverview;
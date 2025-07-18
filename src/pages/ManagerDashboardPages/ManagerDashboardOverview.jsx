import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataContext } from '../../context/DataContext';
import { 
  FaShoppingBag, 
  FaUserTie, 
  FaMoneyBillWave, 
  FaClock,
  FaSpinner
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ManagerDashboardOverview = () => {
  const { user } = useContext(DataContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.branch) {
      fetchStats(user.branch);
    }
  }, [user]);

  const fetchStats = async (branchId) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);

      const head = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    
      const [ordersRes, employeesRes] = await Promise.all([
        axios.get(`http://localhost:5002/laundry/api/order/all/${branchId}`, head),
        axios.get(`http://localhost:5002/laundry/api/users/branch/${branchId}/employees`, head)
      ]);

      const orders = ordersRes.data.data;
      const employees = employeesRes.data.data;

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'not_started').length,
        completedOrders: orders.filter(o => o.status === 'finished').length,
        totalEmployees: employees.length,
        revenue: orders.reduce((sum, order) => sum + (order.is_paid ? order.total_price : 0), 0),
        statusData: [
          { name: 'Not Started', value: orders.filter(o => o.status === 'not_started').length },
          { name: 'Processing', value: orders.filter(o => o.status === 'processing').length },
          { name: 'Finished', value: orders.filter(o => o.status === 'finished').length },
        ]
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaShoppingBag size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaClock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUserTie size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaMoneyBillWave size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardOverview;
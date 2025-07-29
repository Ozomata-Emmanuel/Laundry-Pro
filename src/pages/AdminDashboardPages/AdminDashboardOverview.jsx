import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaReceipt,
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaChartLine,
  FaClipboardList,
  FaInfoCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const AdminDashboardOverview = () => {
  const [employees, setEmployees] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
    activeEmployees: 0,
    avgOrderValue: 0,
    weeklyOrders: 0,
    completionRate: 0,
    newCustomers: 0,
  });

  const [revenueData, setRevenueData] = useState([]);

  const fetchAllData = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(true);
      
      const [ordersRes, employeesRes, inventoryRes, customersRes] = await Promise.all([
        axios.get("http://localhost:5002/laundry/api/order/all", {
          headers: { Authorization: `Bearer ${AdminToken}` }
        }),
        axios.get("http://localhost:5002/laundry/api/users/all", {
          headers: { Authorization: `Bearer ${AdminToken}` }
        }),
        axios.get("http://localhost:5002/laundry/api/inventory", {
          headers: { Authorization: `Bearer ${AdminToken}` }
        }),
        axios.get("http://localhost:5002/laundry/api/users/allcustomers", {
          headers: { Authorization: `Bearer ${AdminToken}` }
        })
      ]);

      if (ordersRes.data.success) {
        const orders = ordersRes.data.data;
        setAllOrders(orders.slice(0, 3));
        
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = orders.filter(
          order => new Date(order.createdAt).toISOString().split("T")[0] === today
        ).length;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear
          );
        });

        const monthlyRevenue = monthlyOrders.reduce(
          (sum, order) => sum + order.total_price,
          0
        );

        const weeklyOrders = orders.filter(
          order => new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;

        const completedOrders = orders.filter(o => o.status === "finished").length;
        const completionRate = orders.length > 0 
          ? Math.round((completedOrders / orders.length) * 100)
          : 0;

        const avgOrderValue = orders.length > 0 
          ? monthlyRevenue / monthlyOrders.length 
          : 0;

        setStats(prev => ({
          ...prev,
          todayOrders,
          monthlyRevenue,
          weeklyOrders,
          completionRate,
          avgOrderValue
        }));

        generateRevenueData(orders);
      }

      if (employeesRes.data.success) {
        const employees = employeesRes.data.data.filter(
          user => ["employee", "manager"].includes(user.role)
        );
        setEmployees(employees);
        setStats(prev => ({
          ...prev,
          activeEmployees: employees.filter(e => e.isActive).length
        }));
      }

      if (inventoryRes.data.success) {
        const inventory = inventoryRes.data.data;
        setInventory(inventory);
        const lowStockItems = inventory.filter(item => item.status === "Low" || item.status === "Critical").length;
        setStats(prev => ({
          ...prev,
          lowStockItems
        }));
      }

      if (customersRes.data.success) {
        const customers = customersRes.data.data;
        setCustomers(customers);
        
        const newCustomers = customers.filter(
          customer => new Date(customer.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
        
        setStats(prev => ({
          ...prev,
          newCustomers
        }));
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueData = (orders) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyRevenue = Array(12).fill(0).map((_, index) => ({
      name: months[index],
      revenue: 0
    }));

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        monthlyRevenue[month].revenue += order.total_price;
      }
    });

    setRevenueData(monthlyRevenue);
  };

  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 30000); 

    return () => clearInterval(intervalId);
  }, []);

  const getTrendIcon = (value, comparisonValue = 0) => {
    if (value > comparisonValue) return <FaArrowUp className="inline ml-1" />;
    if (value < comparisonValue) return <FaArrowDown className="inline ml-1" />;
    return null;
  };

  const getTrendClass = (value, comparisonValue = 0) => {
    if (value > comparisonValue) return "text-green-600";
    if (value < comparisonValue) return "text-red-600";
    return "text-gray-600";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "finished": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const dashboardStats = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      change: `${stats.todayOrders > 0 ? '+' : ''}${stats.todayOrders}`,
      trend: stats.todayOrders > 0 ? "up" : stats.todayOrders < 0 ? "down" : "",
      icon: <FaReceipt className="text-indigo-500 text-xl" />,
      bgColor: "bg-white",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      change: `${stats.activeEmployees > employees.length / 2 ? '+' : ''}${stats.activeEmployees}`,
      trend: stats.activeEmployees > employees.length / 2 ? "up" : "down",
      icon: <FaUsers className="text-blue-500 text-xl" />,
      bgColor: "bg-white",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      change: stats.lowStockItems > 0 ? "Alert" : "OK",
      trend: stats.lowStockItems > 0 ? "alert" : "up",
      icon: <FaBoxOpen className="text-yellow-500 text-xl" />,
      bgColor: stats.lowStockItems > 0 ? "bg-red-50" : "bg-white",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      change: `${stats.monthlyRevenue > 0 ? '+' : ''}${formatCurrency(stats.monthlyRevenue)}`,
      trend: stats.monthlyRevenue > 0 ? "up" : "down",
      icon: <FaMoneyBillWave className="text-green-500 text-xl" />,
      bgColor: "bg-white",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${stat.bgColor}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor.replace('50', '100')}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${getTrendClass(stat.value)} flex items-center`}>
                  {stat.change} {getTrendIcon(stat.value)}
                  {stat.trend === "alert" && (
                    <FaExclamationTriangle className="inline ml-1 text-yellow-500" />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaChartLine className="mr-2 text-indigo-500" />
                Monthly Revenue
              </h2>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Current Year: {new Date().getFullYear()}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickFormatter={(value) => formatCurrency(value).replace('NGN', '₦')}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.revenue > 0 ? '#8884d8' : '#e5e7eb'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-blue-500" />
              Quick Stats
            </h2>
            <div className="space-y-4">
              {[
                { label: "Avg. Order Value", value: formatCurrency(stats.avgOrderValue) },
                { label: "Orders This Week", value: stats.weeklyOrders },
                { label: "Completion Rate", value: `${stats.completionRate}%` },
                { label: "New Customers (30d)", value: stats.newCustomers },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600 flex items-center">
                    {stat.label}
                    {index === 2 && (
                      <FaInfoCircle className="ml-1 text-gray-400 text-xs" />
                    )}
                  </span>
                  <span className="font-medium text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaReceipt className="mr-2 text-indigo-500" />
                Recent Orders
              </h2>
              <Link 
                to="/admin-dashboard/order-management" 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View All
                <FaArrowUp className="ml-1 transform rotate-90 text-xs" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allOrders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {order.user?.first_name ? `${order.user.first_name} ${order.user.last_name}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {formatCurrency(order.total_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status === "finished" ? "Completed" : order.status === "processing" ? "In Progress" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">No orders found</div>
            )}
          </div>

          {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaBoxOpen className="mr-2 text-yellow-500" />
                Inventory Status
              </h2>
              <Link 
                to="/admin-dashboard/inventory" 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View All
                <FaArrowUp className="ml-1 transform rotate-90 text-xs" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.slice(0, 5).map((item) => (
                    <tr 
                      key={item._id} 
                      className={`hover:bg-gray-50 transition-colors ${item.quantity <= 0 ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.quantity <= 0 ? 'bg-red-100 text-red-800' :
                          item.status === "Low" ? 'bg-yellow-100 text-yellow-800' :
                          item.status === "Critical" ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.quantity <= 0 ? 'Out of Stock' : item.status || 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {inventory.length === 0 && (
              <div className="text-center py-8 text-gray-500">No inventory items found</div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiShoppingBag,
  FiDownload,
  FiMail,
  FiEye,
  FiRefreshCw,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('7days');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const fetchOrders = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/laundry/api/order/all", {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
        },
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data?.message);
      toast.error(error.response?.data?.message || "An error occurred while fetching orders");
    }
  };

  const fetchCustomers = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/laundry/api/users/allcustomers", {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
        },
      });
      if (response.data.success) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch customers");
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error("An error occurred while fetching customers");
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

    useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
          customer._id.toLowerCase().includes(searchLower) ||
          `${customer.first_name || ''} ${customer.last_name || ''}`.toLowerCase().includes(searchLower) ||
          (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
          (customer.phone && customer.phone.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);


  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    
    const intervalId = setInterval(() => {
      fetchOrders();
      if (activeTab === 'customer') fetchCustomers();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [activeTab]);

  const processTimeData = () => {
    let dateRange;
    const now = new Date();
    
    switch(timeRange) {
      case '7days':
        dateRange = eachDayOfInterval({
          start: subDays(now, 6),
          end: now
        });
        break;
      case '30days':
        dateRange = eachDayOfInterval({
          start: subDays(now, 29),
          end: now
        });
        break;
      case '90days':
        dateRange = eachDayOfInterval({
          start: subDays(now, 89),
          end: now
        });
        break;
      default:
        dateRange = eachDayOfInterval({
          start: subDays(now, 6),
          end: now
        });
    }

    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOrders = orders.filter(order => 
        isSameDay(parseISO(order.createdAt), date)
      );
      
      return {
        date: format(date, 'MMM d'),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total_price, 0),
        items: dayOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
      };
    });
  };

  const timeData = processTimeData();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const orderStatusCounts = {
    'finished': orders.filter(o => o.status === 'finished').length,
    'processing': orders.filter(o => o.status === 'processing').length,
    'not_started': orders.filter(o => o.status === 'not_started').length
  };

  const getCustomerSegment = (customer) => {
    const customerOrders = orders.filter(o => o.user_id === customer._id).length;
    if (customerOrders > 3) return 'VIP';
    if (customerOrders > 1) return 'Regular';
    return 'New';
  };

  const customerSegments = customers.reduce((segments, customer) => {
    const segment = getCustomerSegment(customer);
    segments[segment] = (segments[segment] || 0) + 1;
    return segments;
  }, {});

  const segmentColors = {
    'VIP': '#8b5cf6',
    'Regular': '#3b82f6',
    'New': '#10b981'
  };

  const topCustomersByOrders = [...customers]
    .map(customer => ({
      ...customer,
      orderCount: orders.filter(o => o.user_id === customer._id).length,
      totalSpent: orders.filter(o => o.user_id === customer._id)
                       .reduce((sum, order) => sum + order.total_price, 0)
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);

  const statusColors = {
    'finished': '#10b981',
    'processing': '#3b82f6',
    'not_started': '#f59e0b'
  };

  const statusIcons = {
    'finished': <FiCheckCircle className="text-green-500" />,
    'processing': <FiClock className="text-blue-500" />,
    'not_started': <FiAlertCircle className="text-yellow-500" />
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Business Analytics</h1>
            <p className="text-gray-600 mt-1">
              {activeTab === 'financial' ? 'Performance insights from order data' : 'Customer analytics'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {activeTab === 'financial' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 flex items-center">
                <FiCalendar className="text-gray-400 mr-2" />
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 focus:outline-none"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                </select>
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                onClick={() => activeTab === 'financial' ? fetchOrders() : fetchCustomers()}
                className="bg-white border border-gray-300 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2"
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2">
                <FiDownload />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <span>Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}</span>
          {loading && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Updating...</span>
            </span>
          )}
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('financial')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'financial' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiDollarSign />
              Financial Reports
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'customer' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiUsers />
              Customer Analytics
            </button>
          </nav>
        </div>

        {activeTab === 'financial' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold mt-1 text-purple-600">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <FiDollarSign size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  From {totalOrders} orders
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold mt-1 text-blue-600">
                      {totalOrders}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FiShoppingBag size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {totalItems} items processed
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Avg. Order Value</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {formatCurrency(avgOrderValue)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 text-green-600">
                    <FiTrendingUp size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {timeData.length > 0 && timeData[0].revenue > 0 && (
                    <span className={`font-medium ${((timeData.at(-1).revenue - timeData[0].revenue) / timeData[0].revenue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {((timeData.at(-1).revenue - timeData[0].revenue) / timeData[0].revenue * 100 >= 0 ? '+' : '')}
                      {(
                        ((timeData.at(-1).revenue - timeData[0].revenue) / timeData[0].revenue) * 100
                      ).toFixed(2)}%
                    </span>
                  )}
                  {timeData.length > 0 && timeData[0].revenue === 0 && (
                    <span className="text-gray-400 font-medium">N/A</span>
                  )} vs start of period
                </div>

              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Items Processed</p>
                    <p className="text-2xl font-bold mt-1 text-indigo-600">
                      {totalItems}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <FiShoppingBag size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Avg. {totalOrders > 0 ? (totalItems / totalOrders).toFixed(1) : 0} items per order
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Daily Revenue & Orders</h2>
                  <div className="flex gap-2">
                    <span className="flex items-center text-sm text-gray-500">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-1"></span>
                      Revenue
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                      Orders
                    </span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Revenue') return formatCurrency(value);
                          return value;
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey="revenue" 
                        fill="#8b5cf6" 
                        radius={[4, 4, 0, 0]} 
                        name="Revenue"
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="orders" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]} 
                        name="Orders"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(orderStatusCounts).map(([status, count]) => ({
                          name: status === 'finished' ? 'Completed' : 
                                status === 'processing' ? 'In Progress' : 'Pending',
                          value: count,
                          color: statusColors[status]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(orderStatusCounts).map(([status, count], index) => (
                          <Cell key={`cell-${index}`} fill={statusColors[status]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} orders`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.user?.first_name && order.user?.last_name
                            ? `${order.user.first_name} ${order.user.last_name}`
                            : `Customer ${order.user_id?.slice(-4).toUpperCase() || ''}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(parseISO(order.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {statusIcons[order.status]}
                            <span className="ml-2">
                              {order.status === 'finished' ? 'Completed' : 
                               order.status === 'processing' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Customers</p>
                    <p className="text-2xl font-bold mt-1 text-indigo-600">
                      {customers.length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <FiUsers size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  From {orders.length} orders
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">VIP Customers</p>
                    <p className="text-2xl font-bold mt-1 text-purple-600">
                      {customerSegments['VIP'] || 0}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <FiUsers size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {customers.length > 0 ? 
                    Math.round((customerSegments['VIP'] || 0) / customers.length * 100) : 0
                  }% of total
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Avg. Customer Value</p>
                    <p className="text-2xl font-bold mt-1 text-blue-600">
                      {formatCurrency(customers.length > 0 ? totalRevenue / customers.length : 0)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FiDollarSign size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {customers.length > 0 ? 
                    (totalOrders / customers.length).toFixed(1) : 0
                  } orders per customer
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Top Customer</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {topCustomersByOrders[0]?.orderCount || 0}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 text-green-600">
                    <FiTrendingUp size={20} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  {topCustomersByOrders[0]?.first_name || 'N/A'} ({formatCurrency(topCustomersByOrders[0]?.totalSpent || 0)} spent)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Segments</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(customerSegments).map(([segment, count]) => ({
                          name: segment,
                          value: count,
                          color: segmentColors[segment]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(customerSegments).map(([segment, count], index) => (
                          <Cell key={`cell-${index}`} fill={segmentColors[segment]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} customers`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Customers by Orders</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topCustomersByOrders}
                      layout="vertical"
                      margin={{ left: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="first_name" 
                        type="category" 
                        width={100}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === 'Orders') return [value, 'Order Count'];
                          if (name === 'Spending') return [formatCurrency(value), 'Total Spent'];
                          return [value, name];
                        }}
                        labelFormatter={(label) => `Customer: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="orderCount" 
                        fill="#3b82f6" 
                        radius={[0, 4, 4, 0]}
                        name="Orders"
                      />
                      <Bar 
                        dataKey="totalSpent" 
                        fill="#8b5cf6" 
                        radius={[0, 4, 4, 0]}
                        name="Spending"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Customer List</h2>
                <input
          type="text"
          placeholder="Search customers..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
              </div>

      {loading ? (
        <div>Loading customers...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.slice(0, 5).map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {customer.first_name?.[0]}{customer.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{customer.email}</div>
                    <div>{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{customer._id.slice(-6).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No customers found matching your search
            </div>
          )}
        </div>
      )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
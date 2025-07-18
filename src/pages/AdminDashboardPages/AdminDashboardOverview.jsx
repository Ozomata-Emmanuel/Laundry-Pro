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
} from "react-icons/fa";
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
} from "recharts";

const AdminDashboardOverview = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [stats, setStats] = useState({
    todayOrders: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
    activeEmployees: 0,
  });

  // Sample data
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
  ];

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/laundry/api/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAllOrders(response.data.data.slice(0, 3));
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = response.data.data.filter(
          (order) =>
            new Date(order.createdAt).toISOString().split("T")[0] === today
        ).length;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyOrders = response.data.data.filter((order) => {
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

        setStats((prev) => ({
          ...prev,
          todayOrders,
          monthlyRevenue,
        }));
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000); 

    return () => clearInterval(intervalId);
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5002/laundry/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setEmployees(response.data.data);
        setStats((prev) => ({
          ...prev,
          activeEmployees: response.data.data.length,
        }));
      } else {
        toast.error(response.data.message || "Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <FaArrowUp className="inline ml-1" />;
      case "down":
        return <FaArrowDown className="inline ml-1" />;
      case "alert":
        return <FaExclamationTriangle className="inline ml-1" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "finished":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      change: "+12%",
      trend: stats.todayOrders > 0 ? "up" : "down",
      icon: <FaReceipt className="text-indigo-500 text-xl" />,
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      change: "+2",
      trend: "up",
      icon: <FaUsers className="text-blue-500 text-xl" />,
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      change: stats.lowStockItems > 0 ? "Alert" : "OK",
      trend: stats.lowStockItems > 0 ? "alert" : "up",
      icon: <FaBoxOpen className="text-yellow-500 text-xl" />,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      change: "+18%",
      trend: "up",
      icon: <FaMoneyBillWave className="text-green-500 text-xl" />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">{stat.icon}</div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "alert"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} {getTrendIcon(stat.trend)}
                </span>
                <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Revenue
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="font-medium">
                  {formatCurrency(
                    stats.monthlyRevenue / (stats.todayOrders || 1)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Orders This Week</span>
                <span className="font-medium">
                  {
                    allOrders.filter(
                      (order) =>
                        new Date(order.createdAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-medium">
                  {allOrders.length > 0
                    ? `${Math.round(
                        (allOrders.filter((o) => o.status === "finished")
                          .length /
                          allOrders.length) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Customers</span>
                <span className="font-medium">24</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All Orders
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {order.user?.first_name ? `${order.user.first_name} ${order.user.last_name}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <div className="flex items-center">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                        items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status === "finished"
                          ? "Completed"
                          : order.status === "processing"
                          ? "In Progress"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 bg-gr py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {formatCurrency(order.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {allOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;

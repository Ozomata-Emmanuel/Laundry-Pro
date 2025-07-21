import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { DataContext } from "../../context/DataContext";
import {
  FaShoppingBag,
  FaUser,
  FaClock,
  FaCheck,
  FaMoneyBillWave,
  FaCreditCard,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaUserTie,
  FaSpinner,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
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
import { toast } from "react-toastify";

const ManagerDashboardOrders = () => {
  const { users } = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [markingPaid, setMarkingPaid] = useState(false);

  const managerUser = users.manager;

  useEffect(() => {
    if (managerUser?.branch) {
      fetchOrders(managerUser.branch);
      fetchEmployees(managerUser.branch);
    }
  }, [managerUser]);

  const fetchOrders = async (branchId) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/order/all/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );

      const employeesRes = await axios.get(
        `http://localhost:5002/laundry/api/users/branch/${branchId}/employees`,
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      const employeesMap = employeesRes.data.data.reduce((acc, employee) => {
        acc[employee._id] = employee;
        return acc;
      }, {});

      const ordersWithEmployees = res.data.data.map((order) => {
        if (order.assigned_employee_id) {
          return {
            ...order,
            employee: employeesMap[order.assigned_employee_id] || null,
          };
        }
        return order;
      });

      setOrders(ordersWithEmployees);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const fetchEmployees = async (branchId) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      const res = await axios.get(
        `http://localhost:5002/laundry/api/users/branch/${branchId}/employees`,
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      const options = res.data.data.map((emp) => ({
        value: emp._id,
        label: `${emp.first_name} ${emp.last_name}`,
      }));
      setEmployees(options);
    } catch (err) {
      setError("Failed to fetch employees");
    }
  };

  const markAsPaid = async (orderId) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    setMarkingPaid(true);
    try {
      const res = await axios.put(
        `http://localhost:5002/laundry/api/order/mark-paid/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Payment marked as paid successfully!");
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, is_paid: true } : order
          )
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, is_paid: true });
        }
      } else {
        throw new Error(res.data.message || "Failed to mark as paid");
      }
    } catch (err) {
      console.error(
        "Error marking as paid:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Failed to mark as paid");
    } finally {
      setMarkingPaid(false);
    }
  };

  const handleAssignEmployee = async (orderId, employeeId) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      setAssignLoading(true);
      await axios.patch(
        `http://localhost:5002/laundry/api/order/update-status/${orderId}`,
        {
          assigned_employee_id: employeeId,
          status: "processing",
        },
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      fetchOrders(user.branch);
      setAssignLoading(false);
    } catch (err) {
      setError("Failed to assign employee");
      setAssignLoading(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.first_name + " " + order.user?.last_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusData = [
    {
      name: "Not Started",
      value: orders.filter((o) => o.status === "not_started").length,
    },
    {
      name: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
    },
    {
      name: "Finished",
      value: orders.filter((o) => o.status === "finished").length,
    },
  ];

  const paymentData = [
    { name: "Paid", value: orders.filter((o) => o.is_paid).length },
    { name: "Unpaid", value: orders.filter((o) => !o.is_paid).length },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-3 text-lg">Loading orders...</span>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="processing">Processing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaClock className="mr-2 text-blue-500" /> Orders by Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" /> Payment Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user?.first_name
                        ? `${order.user.first_name} ${order.user.last_name}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaShoppingBag className="mr-2 text-indigo-600" />
                        {order.items.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{" "}
                        items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "finished"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.assigned_employee_id ? (
                        <div className="flex items-center">
                          <FaUserTie className="mr-2 text-gray-600" />
                          {order.employee?.first_name}{" "}
                          {order.employee?.last_name}
                        </div>
                      ) : (
                        <Select
                          options={employees}
                          onChange={(selected) =>
                            handleAssignEmployee(order._id, selected.value)
                          }
                          placeholder="Assign employee"
                          className="text-sm w-40"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "36px",
                              fontSize: "0.875rem",
                            }),
                          }}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className={`fixed inset-0 bg-[#04001ae5] z-50 flex items-center justify-center p-4 ${
            isModalOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Order #{selectedOrder._id.slice(-6).toUpperCase()}
                  </h2>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.status === "finished"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {selectedOrder.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.is_paid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedOrder.is_paid ? "PAID" : "UNPAID"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-3">
                      <FaUser className="text-blue-600 text-lg" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-700">
                      Customer Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedOrder.user?.first_name || "N/A"}{" "}
                        {selectedOrder.user?.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedOrder.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedOrder.user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full mr-3">
                      <FaUserTie className="text-purple-600 text-lg" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-700">
                      Assignment
                    </h3>
                  </div>
                  {selectedOrder.assigned_employee_id ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Assigned Employee
                        </p>
                        <p className="font-medium">
                          {selectedOrder.employee?.first_name || "N/A"}{" "}
                          {selectedOrder.employee?.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned Since</p>
                        <p className="font-medium">
                          {new Date(
                            selectedOrder.updatedAt
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            selectedOrder.updatedAt
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-500">No employee assigned</p>
                      <Select
                        options={employees}
                        onChange={(selected) => {
                          handleAssignEmployee(
                            selectedOrder._id,
                            selected.value
                          );
                          setIsModalOpen(false);
                        }}
                        placeholder="Assign employee..."
                        className="text-sm"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: "40px",
                            borderColor: "#e5e7eb",
                            "&:hover": {
                              borderColor: "#9ca3af",
                            },
                          }),
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full mr-3">
                      <FaMoneyBillWave className="text-green-600 text-lg" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-700">
                      Payment
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Method</p>
                      <p className="font-medium">
                        {selectedOrder.payment_type.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">
                        ₦
                        {selectedOrder.total_price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          selectedOrder.is_paid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedOrder.is_paid ? "Paid" : "Unpaid"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-3">
                    <FaShoppingBag className="text-indigo-600 text-lg" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-700">
                    Order Items
                  </h3>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {item.description}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₦
                            {item.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            ₦
                            {(item.price * item.quantity).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-right font-medium"
                        >
                          Subtotal
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ₦
                          {selectedOrder.total_price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-right font-medium"
                        >
                          Tax
                        </td>
                        <td className="px-6 py-4 font-medium">₦0.00</td>
                      </tr>
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-right font-bold"
                        >
                          Total
                        </td>
                        <td className="px-6 py-4 font-bold">
                          ₦
                          {selectedOrder.total_price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {selectedOrder.delivery_option === "dropoff" && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-100 p-3 rounded-full mr-3">
                        <FaMapMarkerAlt className="text-orange-600 text-lg" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-700">
                        Delivery Information
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{selectedOrder.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Scheduled</p>
                        <p className="font-medium">
                          {new Date(
                            selectedOrder.delivery_date
                          ).toLocaleDateString()}{" "}
                          at {selectedOrder.delivery_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Option</p>
                        <p className="font-medium capitalize">
                          {selectedOrder.delivery_option}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedOrder.special_requests ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-yellow-100 p-3 rounded-full mr-3">
                        <FaInfoCircle className="text-yellow-600 text-lg" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-700">
                        Special Requests
                      </h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="whitespace-pre-line text-gray-700">
                        {selectedOrder.special_requests}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-yellow-100 p-3 rounded-full mr-3">
                        <FaInfoCircle className="text-yellow-600 text-lg" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-700">
                        Special Requests
                      </h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="whitespace-pre-line text-gray-700">
                        No special requests
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <FaClock className="text-blue-600 text-lg" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-700">
                    Order Timeline
                  </h3>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-4 pl-10">
                    <div className="relative">
                      <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-blue-500 border-4 border-blue-100"></div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-medium">Order Created</p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <div className="relative">
                        <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 border-4 border-green-100"></div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium">Status Updated</p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedOrder.updatedAt).toLocaleString()}
                          </p>
                          <p className="text-sm mt-1">
                            Changed to:{" "}
                            <span className="font-medium capitalize">
                              {selectedOrder.status.replace("_", " ")}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {!selectedOrder.is_paid && (
                  <button
                    onClick={() => markAsPaid(selectedOrder._id)}
                    disabled={markingPaid}
                    className={`px-6 py-2 ${
                      markingPaid
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white rounded-lg transition-colors flex items-center justify-center`}
                  >
                    {markingPaid ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Mark as Paid"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardOrders;

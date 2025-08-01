import React, { useState, useEffect, useContext } from "react";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { DataContext } from "../../context/DataContext";
import {
  FaShoppingBag,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

const EmployeeDashboardOrder = () => {
  const { users } = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportingIssue, setReportingIssue] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [orderIssues, setOrderIssues] = useState([]);
  const [fetchingIssues, setFetchingIssues] = useState(false);
  const employeeUser = users.employee;

  useEffect(() => {
    if (employeeUser?.id) {
      fetchAssignedOrders(employeeUser.id);
    }
  }, [employeeUser]);

  const fetchAssignedOrders = async (employeeId) => {
    const EmployeeToken = localStorage.getItem("EmployeeToken");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/orders/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${EmployeeToken}`,
          },
        }
      );
      setOrders(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch assigned orders");
      setLoading(false);
    }
  };

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    await fetchOrderIssues(order._id);
  };

  const handleReportIssue = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5002/laundry/api/issue",
        {
          order_id: selectedOrder._id,
          branch_id: employeeUser?.branch,
          description: issueDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("EmployeeToken")}`,
          },
        }
      );
      
      setOrderIssues([response.data.data, ...orderIssues]);
      setIssueDescription("");
      setReportingIssue(false);
      toast.success("Issue reported successfully");
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("Failed to report issue");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await axios.patch(
        `http://localhost:5002/laundry/api/order/update-status/${orderId}`,
        {
          status: newStatus,
        }
      );
      fetchAssignedOrders(employeeUser.id);
      setUpdatingStatus(null);
    } catch (err) {
      setError("Failed to update order status");
      setUpdatingStatus(null);
    }
  };

  const fetchOrderIssues = async (orderId) => {
    try {
      setFetchingIssues(true);
      const response = await axios.get(
        `http://localhost:5002/laundry/api/issues/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("EmployeeToken")}`,
          },
        }
      );
      setOrderIssues(response.data.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setFetchingIssues(false);
    }
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-3 text-lg">Loading your orders...</span>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Your Assigned Orders
          </h1>
          <p className="text-gray-600 mt-1">
            {orders.length} total orders •{" "}
            {orders.filter((o) => o.status === "processing").length} in progress
          </p>
        </div>
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
              <option value="processing">Processing</option>
              <option value="finished">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y text-gray-500  divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-400">
                      {order.user?.first_name
                        ? `${order.user.first_name} ${order.user.last_name}`
                        : "N/A"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center font-semibold">
                        <FaShoppingBag className="mr-2 text-indigo-600" />
                        {order.items.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{" "}
                        items
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      ₦
                      {order.total_price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {formatDate(order.updatedAt)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
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
                    <td className="px-3 py-4 whitespace-nowrap">
                      {order.status === "processing" ? (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "finished")
                          }
                          disabled={updatingStatus === order._id}
                          className={`flex items-center px-3 py-1 rounded-lg ${
                            updatingStatus === order._id
                              ? "bg-gray-200 text-gray-600"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {updatingStatus === order._id ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaCheck className="mr-1" />
                          )}
                          Mark Complete
                        </button>
                      ) : (
                        <span className="text-gray-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Assigned
              </p>
              <p className="text-3xl font-bold mt-1">{orders.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingBag className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-3xl font-bold mt-1">
                {orders.filter((o) => o.status === "processing").length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-3xl font-bold mt-1">
                {orders.filter((o) => o.status === "finished").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
{selectedOrder && (
  <div
    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100">
      <div className="flex justify-between items-center border-b border-gray-100 p-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Order #{selectedOrder._id.slice(-6).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(selectedOrder.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(false);
            setReportingIssue(false);
            setIssueDescription("");
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
              <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <FaShoppingBag className="mr-2 text-indigo-600" />
                Order Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">
                    {selectedOrder.user?.first_name} {selectedOrder.user?.last_name}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">
                    {selectedOrder.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedOrder.status === 'finished' ? 'bg-green-100 text-green-800' :
                    selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h4 className="font-semibold text-lg text-gray-800 mb-4">Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.special_requests && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <FaInfoCircle className="text-yellow-500 mr-2 text-lg" />
                  <h4 className="font-semibold text-lg text-gray-800">Special Requests</h4>
                </div>
                <div className="bg-white p-3 rounded-lg border border-yellow-200">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedOrder.special_requests}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  Reported Issues
                </h4>
                {!reportingIssue && (
                  <button
                    onClick={() => setReportingIssue(true)}
                    className="text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all flex items-center"
                  >
                    + Report Issue
                  </button>
                )}
              </div>

              {reportingIssue ? (
                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3">Describe the issue</h5>
                  <textarea
                    className="w-full outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows="4"
                    placeholder="What problem did you encounter with this order?"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => {
                        setReportingIssue(false);
                        setIssueDescription("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReportIssue}
                      disabled={issueDescription.length < 10}
                      className={`px-4 py-2 rounded-lg text-white transition-all ${
                        issueDescription.length < 10
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
                      }`}
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              ) : null}

              {fetchingIssues ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : orderIssues.length > 0 ? (
                <div className="space-y-4">
                  {orderIssues.map((issue) => (
                    <div 
                      key={issue._id} 
                      className={`border-l-4 p-4 rounded-lg ${
                        issue.status === 'resolved' ? 'border-green-500 bg-green-50' :
                        issue.status === 'in_progress' ? 'border-yellow-500 bg-yellow-50' :
                        'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{issue.description}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span>
                              Reported on {new Date(issue.createdAt).toLocaleString()}
                            </span>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {issue.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <FaExclamationTriangle className="mx-auto text-gray-400 text-3xl mb-3" />
                  <p className="text-gray-500 font-medium">No issues reported yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Found a problem? Click "Report Issue" above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl flex justify-end">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setReportingIssue(false);
            setIssueDescription("");
          }}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default EmployeeDashboardOrder;
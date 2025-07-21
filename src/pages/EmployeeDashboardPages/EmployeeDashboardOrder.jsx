import React, { useState, useEffect, useContext } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { DataContext } from '../../context/DataContext';
import { 
  FaShoppingBag, 
  FaUser, 
  FaClock, 
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const EmployeeDashboardOrder = () => {
  const { users } = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const res = await axios.get(`http://localhost:5002/laundry/api/orders/employee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${EmployeeToken}`,
        },
      });
      console.log(res.data)
      setOrders(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch assigned orders');
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await axios.patch(`http://localhost:5002/laundry/api/order/update-status/${orderId}`, {
        status: newStatus
      });
      fetchAssignedOrders(user.id);
      setUpdatingStatus(null);
    } catch (err) {
      setError('Failed to update order status');
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.first_name + ' ' + order.user?.last_name).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
          <h1 className="text-3xl font-bold text-gray-800">Your Assigned Orders</h1>
          <p className="text-gray-600 mt-1">
            {orders.length} total orders • {orders.filter(o => o.status === 'processing').length} in progress
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOrderClick(order)}>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">#{order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {order.user?.first_name ? `${order.user.first_name} ${order.user.last_name}` : 'N/A'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaShoppingBag className="mr-2 text-indigo-600" />
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      ₦{order.total_price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {formatDate(order.updatedAt)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'finished' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {order.status === 'processing' ? (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'finished')}
                          disabled={updatingStatus === order._id}
                          className={`flex items-center px-3 py-1 rounded-lg ${
                            updatingStatus === order._id ? 
                            'bg-gray-200 text-gray-600' : 
                            'bg-green-600 text-white hover:bg-green-700'
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
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
              <p className="text-sm font-medium text-gray-500">Total Assigned</p>
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
              <p className="text-3xl font-bold mt-1">{orders.filter(o => o.status === 'processing').length}</p>
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
              <p className="text-3xl font-bold mt-1">{orders.filter(o => o.status === 'finished').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      {selectedOrder && (
  <div className={`fixed inset-0 bg-[#040013ea] z-50 flex items-center justify-center p-4 ${isModalOpen ? "block" : "hidden"}`}>
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-lg font-semibold">
          Order #{selectedOrder._id.slice(-6).toUpperCase()}
        </h3>
        <button 
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="p-4">
        {selectedOrder.special_requests ? (
          <>
            <div className="flex items-center mb-3">
              <FaInfoCircle className="text-yellow-500 mr-2" />
              <h4 className="font-medium">Special Requests</h4>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="whitespace-pre-line">{selectedOrder.special_requests}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No special requests for this order</p>
        )}
      </div>
      
      <div className="border-t p-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
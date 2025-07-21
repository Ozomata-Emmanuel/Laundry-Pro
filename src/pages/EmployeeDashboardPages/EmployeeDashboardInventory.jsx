import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaPlus, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { DataContext } from '../../context/DataContext';

const EmployeeDashboardInventory = () => {
  const { users } = useContext(DataContext);
  const [requests, setRequests] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [loading, setLoading] = useState({
    requests: false,
    inventory: false,
    orders: false,
    submitting: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const employeeUser = users.employee;

  const fetchRequests = async () => {
    const EmployeeToken = localStorage.getItem("EmployeeToken");
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const res = await axios.get(
        `http://localhost:5002/laundry/api/employee-requests/employee/${employeeUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${EmployeeToken}`,
          },
        }
      );
      setRequests(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch requests");
      console.log(err.response)
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const fetchInventory = async () => {
    const EmployeeToken = localStorage.getItem("EmployeeToken");
    try {
      setLoading(prev => ({ ...prev, inventory: true }));
      const res = await axios.get(
        "http://localhost:5002/laundry/api/inventory",
        {
          headers: {
            Authorization: `Bearer ${EmployeeToken}`,
          },
        }
      );
      setInventoryItems(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(prev => ({ ...prev, inventory: false }));
    }
  };

  const fetchAssignedOrders = async () => {
    const EmployeeToken = localStorage.getItem("EmployeeToken");
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const res = await axios.get(
        `http://localhost:5002/laundry/api/orders/employee/${employeeUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${EmployeeToken}`,
          },
        }
      );
      setAssignedOrders(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch assigned orders");
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const createRequest = async () => {
    const EmployeeToken = localStorage.getItem("EmployeeToken");
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      
      const validItems = selectedItems.filter(item => item.quantity > 0);
      if (validItems.length === 0) {
        throw new Error("Please select at least one item with quantity");
      }

      const response = await axios.post(
        "http://localhost:5002/laundry/api/employee-requests/create",
        {
          orderId: selectedOrderId,
          items: validItems.map(item => ({
            inventoryItem: item.inventoryItem,
            quantity: item.quantity
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${EmployeeToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Request submitted successfully");
        setShowRequestModal(false);
        setSelectedOrderId('');
        setSelectedItems([]);
        await fetchRequests();
      } else {
        throw new Error(response.data.error || "Failed to submit request");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Failed to submit request");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  useEffect(() => {
    if (employeeUser?.id) {
      fetchRequests();
      fetchInventory();
      fetchAssignedOrders();
    }
  }, [employeeUser]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    fulfilled: 'bg-green-100 text-green-800'
  };

  const handleItemQuantityChange = (itemId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    
    if (numQuantity > 0) {
      const existingItemIndex = selectedItems.findIndex(item => item.inventoryItem === itemId);
      if (existingItemIndex >= 0) {
        const updatedItems = [...selectedItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: numQuantity
        };
        setSelectedItems(updatedItems);
      } else {
        setSelectedItems([
          ...selectedItems,
          {
            inventoryItem: itemId,
            quantity: numQuantity
          }
        ]);
      }
    } else {
      setSelectedItems(selectedItems.filter(item => item.inventoryItem !== itemId));
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.order?.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Inventory Requests</h1>
          <p className="text-gray-600 mt-1">
            {requests.length} total requests • {requests.filter(r => r.status === 'pending').length} pending
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center"
            disabled={assignedOrders.length === 0 || loading.orders}
            title={assignedOrders.length === 0 ? "No assigned orders available" : ""}
          >
            <FaPlus className="mr-2" /> New Request
          </button>
        </div>
      </div>

      {loading.requests && !requests.length ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(request => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600 font-medium">
                          {request.order?.order_number || `#${request.orderId?.slice(-6)?.toUpperCase()}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {request.items.map(item => (
                            <div key={item._id} className="flex items-center">
                              <span className="font-medium mr-2">{item.quantity}x</span>
                              <span>{item.inventoryItem?.name || 'Unknown Item'}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No requests found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-[#04000ed5] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Inventory Request</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Select Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading.orders}
                >
                  <option value="">Select an order</option>
                  {assignedOrders.map(order => (
                    <option key={order._id} value={order._id}>
                      Order #{order._id.slice(-6).toUpperCase()} - {order.user?.first_name} {order.user?.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Selected Items</label>
                <div className="border rounded p-3 h-full">
                  {selectedItems.filter(item => item.quantity > 0).length > 0 ? (
                    <ul className="space-y-2">
                      {selectedItems.filter(item => item.quantity > 0).map(item => {
                        const inventoryItem = inventoryItems.find(i => i._id === item.inventoryItem);
                        return (
                          <li key={item.inventoryItem} className="flex justify-between">
                            <span>{inventoryItem?.name || 'Unknown Item'}</span>
                            <span className="font-medium">{item.quantity} {inventoryItem?.unit}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No items selected</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Available Inventory Items</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                {inventoryItems.map(item => (
                  <div key={item._id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Available: {item.currentStock} {item.unit}</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={item.currentStock}
                      onChange={(e) => handleItemQuantityChange(item._id, e.target.value)}
                      className="w-20 p-2 border rounded text-center"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedOrderId('');
                  setSelectedItems([]);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={createRequest}
                disabled={loading.submitting || !selectedOrderId || selectedItems.filter(item => item.quantity > 0).length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.submitting ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Submitting...
                  </>
                ) : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboardInventory;
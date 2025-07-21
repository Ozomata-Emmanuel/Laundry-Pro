import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSpinner, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaBoxOpen, 
  FaCheck, 
  FaTruck,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminFulfillmentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState({
    list: false,
    details: false,
    fulfillment: false
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const res = await axios.get(
        "http://localhost:5002/laundry/api/employee-requests/all",
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );
      
      let filteredData = res.data.data;
      if (filter !== 'all') {
        filteredData = filteredData.filter(req => req.status === filter);
      }
      
      if (searchTerm) {
        filteredData = filteredData.filter(req => 
          req.order?.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.employee?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.employee?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setRequests(filteredData);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch requests");
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  const fetchRequestDetails = async (requestId) => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(prev => ({ ...prev, details: true }));
      const res = await axios.get(
        `http://localhost:5002/laundry/api/employee-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );
      setSelectedRequest(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch request details");
    } finally {
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

  const fulfillRequest = async () => {
    if (!selectedRequest) return;
    
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(prev => ({ ...prev, fulfillment: true }));
      await axios.put(
        `http://localhost:5002/laundry/api/employee-requests/${selectedRequest._id}/fulfill`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );
      toast.success("Request fulfilled successfully");
      setSelectedRequest(null);
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fulfill request");
    } finally {
      setLoading(prev => ({ ...prev, fulfillment: false }));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`}>
            <FaCheck className="mr-1.5" /> Approved
          </span>
        );
      case 'fulfilled':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
            <FaTruck className="mr-1.5" /> Fulfilled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaBoxOpen className="text-blue-600" />
            Inventory Fulfillment Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage and fulfill employee inventory requests</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchRequests()}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="all">All Requests</option>
              <option value="approved">Approved Only</option>
              <option value="fulfilled">Fulfilled Only</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading.list && !requests.length ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
                          <span>Loading requests...</span>
                        </div>
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FaBoxOpen className="text-3xl text-gray-400 mb-2" />
                          <p>No requests found matching your criteria</p>
                          <button 
                            onClick={() => {
                              setFilter('all');
                              setSearchTerm('');
                              fetchRequests();
                            }}
                            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Reset filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    requests.map(request => (
                      <tr 
                        key={request._id} 
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedRequest?._id === request._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-600 font-medium">
                            {request.order?.order_number || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {request.employee?.first_name?.charAt(0)}{request.employee?.last_name?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {request.employee?.first_name} {request.employee?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.employee?.position || 'Employee'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {request.items.slice(0, 3).map(item => (
                              <span 
                                key={item._id} 
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                              >
                                {item.quantity}x {item.inventoryItem?.name?.split(' ')[0] || 'Item'}
                              </span>
                            ))}
                            {request.items.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                +{request.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => fetchRequestDetails(request._id)}
                            className={`flex items-center text-sm px-3 py-1.5 rounded-md ${
                              selectedRequest?._id === request._id 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            disabled={loading.details}
                          >
                            {loading.details && request._id === selectedRequest?._id ? (
                              <FaSpinner className="animate-spin mr-2" />
                            ) : (
                              <FaInfoCircle className="mr-2" />
                            )}
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Request Details Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-500" />
              Request Details
            </h2>
            
            {selectedRequest ? (
              <div className="space-y-5">
                {loading.details ? (
                  <div className="flex justify-center items-center h-40">
                    <FaSpinner className="animate-spin text-2xl text-blue-600" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order #:</span>
                        <span className="font-medium">{selectedRequest.order?.order_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employee:</span>
                        <span className="font-medium">
                          {selectedRequest.employee?.first_name} {selectedRequest.employee?.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved By:</span>
                        <span className="font-medium">
                          {selectedRequest.managerApproval?.approvedBy?.first_name || 'Unknown'} on {' '}
                          {new Date(selectedRequest.managerApproval?.approvedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedRequest.fulfilledBy && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fulfilled By:</span>
                          <span className="font-medium">
                            {selectedRequest.fulfilledBy?.first_name || 'Unknown'} on {' '}
                            {new Date(selectedRequest.fulfilledAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-700 mb-3">Items Requested</h4>
                      <div className="space-y-3">
                        {selectedRequest.items.map(item => (
                          <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.quantity}x {item.inventoryItem?.name}</p>
                              <p className="text-sm text-gray-500">{item.inventoryItem?.category}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              item.inventoryItem?.currentStock >= item.quantity 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              Stock: {item.inventoryItem?.currentStock || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedRequest.managerApproval?.notes && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Manager Notes</h4>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <p className="text-blue-700 whitespace-pre-line">{selectedRequest.managerApproval.notes}</p>
                        </div>
                      </div>
                    )}

                    {selectedRequest.status === 'approved' && (
                      <div className="border-t border-gray-200 pt-4">
                        <button
                          onClick={fulfillRequest}
                          disabled={loading.fulfillment || selectedRequest.items.some(
                            item => item.inventoryItem?.currentStock < item.quantity
                          )}
                          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors ${
                            loading.fulfillment
                              ? 'bg-green-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700'
                          } flex items-center justify-center`}
                        >
                          {loading.fulfillment ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaCheckCircle className="mr-2" />
                          )}
                          Fulfill Request
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <FaInfoCircle className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No request selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a request from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFulfillmentDashboard;
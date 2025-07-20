import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaCheckCircle, FaInfoCircle, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminFulfillmentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState({
    list: false,
    details: false,
    fulfillment: false
  });

  // Fixed endpoint - now correctly fetching approved requests
  const fetchApprovedRequests = async () => {
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
      setRequests(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch requests");
      console.log(err.response)
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
      await fetchApprovedRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fulfill request");
    } finally {
      setLoading(prev => ({ ...prev, fulfillment: false }));
    }
  };

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center mb-6">
        <FaBoxOpen className="text-blue-600 mr-3 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Inventory Fulfillment Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="lg:col-span-2">
          {loading.list && !requests.length ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-2xl text-blue-600" />
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">No approved requests pending fulfillment</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map(request => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-600 font-medium">
                            {request.order?.order_number || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.employee?.first_name} {request.employee?.last_name}
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
                          <button
                            onClick={() => fetchRequestDetails(request._id)}
                            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
                            disabled={loading.details}
                          >
                            {loading.details && request._id === selectedRequest?._id ? (
                              <FaSpinner className="animate-spin inline mr-1" />
                            ) : (
                              <FaInfoCircle className="inline mr-1" />
                            )}
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Request Details Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaInfoCircle className="text-blue-500 mr-2" />
            Request Details
          </h2>
          
          {selectedRequest ? (
            <div className="space-y-4">
              {loading.details ? (
                <div className="flex justify-center items-center h-40">
                  <FaSpinner className="animate-spin text-2xl text-blue-600" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
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
                        {new Date(selectedRequest.managerApproval?.approvedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Items Requested:</h4>
                    <div className="space-y-2">
                      {selectedRequest.items.map(item => (
                        <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">{item.quantity}x</span> {item.inventoryItem?.name}
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
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
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-1">Manager Notes:</h4>
                      <p className="text-blue-700">{selectedRequest.managerApproval.notes}</p>
                    </div>
                  )}

                  <button
                    onClick={fulfillRequest}
                    disabled={loading.fulfillment || selectedRequest.items.some(
                      item => item.inventoryItem?.currentStock < item.quantity
                    )}
                    className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors flex items-center justify-center"
                  >
                    {loading.fulfillment ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaCheckCircle className="mr-2" />
                    )}
                    Fulfill Request
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaInfoCircle className="mx-auto text-2xl mb-2 text-gray-400" />
              <p>Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFulfillmentDashboard;
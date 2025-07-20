import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaCheck, FaTimes, FaClipboardList, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ManagerDashboardApproveRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [activeRequestId, setActiveRequestId] = useState(null);

  const fetchPendingRequests = async () => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5002/laundry/api/employee-requests/pending",
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      setRequests(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (requestId, approved) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      setLoading(true);
      const endpoint = approved ? 'approve' : 'reject';
      await axios.put(
        `http://localhost:5002/laundry/api/employee-requests/${requestId}/${endpoint}`,
        { notes: decisionNotes },
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      toast.success(`Request ${approved ? 'approved' : 'rejected'}`);
      fetchPendingRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update request");
    } finally {
      setLoading(false);
      setDecisionNotes('');
      setActiveRequestId(null);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <FaClipboardList className="text-blue-600 mr-3 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Pending Employee Requests</h1>
      </div>
      
      {loading && !requests.length ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">No pending requests at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request._id} className="border border-gray-200 p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">{request.employee?.name || 'Unknown Employee'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
                      Order #{request.order?.order_number}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-700 mb-2">Requested Items:</h4>
                    <ul className="space-y-1">
                      {request.items.map(item => (
                        <li key={item._id} className="flex justify-between bg-gray-50 p-2 rounded">
                          <span className="text-gray-800">{item.inventoryItem?.name}</span>
                          <span className="font-medium text-blue-600">{item.quantity}x</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleDecision(request._id, true)}
                    disabled={loading}
                    className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleDecision(request._id, false)}
                    disabled={loading}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <textarea
                  value={activeRequestId === request._id ? decisionNotes : ''}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  onFocus={() => setActiveRequestId(request._id)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Add decision notes (optional)"
                  rows="2"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardApproveRequest;
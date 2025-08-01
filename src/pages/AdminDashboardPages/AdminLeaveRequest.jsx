import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaUser, FaCheck, FaTimes, FaClock, FaSearch } from 'react-icons/fa';

const AdminLeaveRequest = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5002/laundry/api/leave/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('AdminToken')}`
        }
      });
      
      if (response.data.success) {
        setLeaves(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch leave requests');
        toast.error(response.data.message || 'Failed to fetch leave requests');
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError(error.response?.data?.message || 'Failed to fetch leave requests');
      toast.error(error.response?.data?.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedLeave) return;
    
    try {
      setActionLoading(true);
      const response = await axios.patch(
        `http://localhost:5002/laundry/api/leave/update-status/${selectedLeave._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AdminToken')}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Leave request ${status}`);
        fetchLeaves();
        setSelectedLeave(null);
      } else {
        toast.error(response.data.message || `Failed to ${status} leave request`);
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error(error.response?.data?.message || `Failed to ${status} leave request`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      (leave.employeeId?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employeeId?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getEmployeeName = (employee) => {
    if (!employee) return 'Unknown Employee';
    return `${employee.first_name || ''} ${employee.last_name || ''}`.trim() || 'Unknown Employee';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Leave Requests Management</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search leaves..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="w-full md:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button
                  onClick={fetchLeaves}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeaves.length > 0 ? (
                      filteredLeaves.map((leave) => (
                        <tr key={leave._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getEmployeeName(leave.employeeId)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {leave.leaveType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2 text-gray-400" />
                              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {calculateDays(leave.startDate, leave.endDate)} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(leave.status)}`}>
                              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedLeave(leave)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No leave requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedLeave && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Leave Request Details</h3>
                  <p className="text-gray-600">
                    Requested by {getEmployeeName(selectedLeave.employeeId)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Leave Type</h4>
                    <p className="text-gray-900 capitalize">{selectedLeave.leaveType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(selectedLeave.status)}`}>
                      {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Start Date</h4>
                    <p className="text-gray-900">{formatDate(selectedLeave.startDate)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">End Date</h4>
                    <p className="text-gray-900">{formatDate(selectedLeave.endDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                    <p className="text-gray-900">
                      {calculateDays(selectedLeave.startDate, selectedLeave.endDate)} days
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Reason</h4>
                  <p className="text-gray-900">{selectedLeave.reason || 'No reason provided'}</p>
                </div>

                {selectedLeave.approvedBy && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      {selectedLeave.status === 'approved' ? 'Approved' : 'Rejected'} by
                    </h4>
                    <p className="text-gray-900">
                      {getEmployeeName(selectedLeave.approvedBy)} on {formatDate(selectedLeave.approvedAt)}
                    </p>
                  </div>
                )}
              </div>

              {selectedLeave.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    {actionLoading ? (
                      <FaClock className="animate-spin mr-2" />
                    ) : (
                      <FaTimes className="mr-2" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {actionLoading ? (
                      <FaClock className="animate-spin mr-2" />
                    ) : (
                      <FaCheck className="mr-2" />
                    )}
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequest;
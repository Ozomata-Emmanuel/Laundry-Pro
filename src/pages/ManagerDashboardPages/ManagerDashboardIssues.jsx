import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaExclamationTriangle, 
  FaSpinner, 
  FaCheck, 
  FaClock,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { DataContext } from '../../context/DataContext';

const ManagerDashboardIssues = () => {
  const { users } = useContext(DataContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const managerUser = users.manager;

  useEffect(() => {
    if (managerUser?.branch) {
      fetchBranchIssues(managerUser.branch);
    }
  }, [managerUser]);

  const fetchBranchIssues = async (branchId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5002/laundry/api/issues/branch/${branchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ManagerToken')}`
        }
      });
      setIssues(response.data.data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to fetch issues');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      setUpdatingStatus(issueId);
      const response = await axios.patch(
        `http://localhost:5002/laundry/api/issues/${issueId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ManagerToken')}`
          }
        }
      );
      
      setIssues(issues.map(issue => 
        issue._id === issueId ? response.data.data : issue
      ));
      toast.success(`Issue marked as ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredIssues = (issues || []).filter(issue => {
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.reporter?.first_name + ' ' + issue.reporter?.last_name).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'in_progress':
        return <FaClock className="text-yellow-500" />;
      case 'resolved':
        return <FaCheck className="text-green-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
  };

  const getAvailableActions = (currentStatus) => {
    switch (currentStatus) {
      case 'open':
        return ['in_progress'];
      case 'in_progress':
        return ['resolved'];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-3 text-lg">Loading issues...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reported Issues</h1>
          <p className="text-gray-600 mt-1">
            {filteredIssues.length} issues found • {filteredIssues.filter(i => i.status === 'open').length} open
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search issues..."
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => {
                  const availableActions = getAvailableActions(issue.status);
                  
                  return (
                    <tr key={issue._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-normal max-w-xs">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            {getStatusIcon(issue.status)}
                          </div>
                          <div>
                            <p className="text-gray-800">{issue.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Reported: {new Date(issue.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {issue.reporter?.first_name} {issue.reporter?.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600 font-medium">
                          #{issue.order?._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {availableActions.includes('in_progress') && (
                            <button
                              onClick={() => handleStatusChange(issue._id, 'in_progress')}
                              disabled={updatingStatus === issue._id}
                              className={`px-3 py-1 rounded-lg text-xs ${
                                updatingStatus === issue._id
                                  ? 'bg-gray-200 text-gray-600'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {updatingStatus === issue._id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                'Start Progress'
                              )}
                            </button>
                          )}
                          {availableActions.includes('resolved') && (
                            <button
                              onClick={() => handleStatusChange(issue._id, 'resolved')}
                              disabled={updatingStatus === issue._id}
                              className={`px-3 py-1 rounded-lg text-xs ${
                                updatingStatus === issue._id
                                  ? 'bg-gray-200 text-gray-600'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {updatingStatus === issue._id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                'Mark Resolved'
                              )}
                            </button>
                          )}
                          {availableActions.length === 0 && (
                            <span className="text-gray-400 text-xs">No actions available</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaExclamationTriangle className="text-3xl text-gray-300 mb-3" />
                      <p className="text-lg">No issues found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search' : 'No issues have been reported yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardIssues;
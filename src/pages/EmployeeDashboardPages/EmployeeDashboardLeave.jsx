import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataContext";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaTrash,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";

const EmployeeDashboardLeave = () => {
  const { user } = useContext(DataContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [newLeave, setNewLeave] = useState({
    leaveType: "vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const employeeId = user?.id;

  useEffect(() => {
    fetchEmployeeLeaves();
  }, [employeeId]);

  const fetchEmployeeLeaves = async () => {
    if (!employeeId) return;
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/leave/all/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaves(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch leave requests");
      setLoading(false);
    }
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5002/laundry/api/leave/apply",
        {
          ...newLeave,
          employeeId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaves([response.data.data, ...leaves]);
      setNewLeave({
        leaveType: "vacation",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
      setLoading(false);
    }
  };

  const handleDeleteLeave = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5002/laundry/api/leave/${selectedLeave._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaves(leaves.filter((leave) => leave._id !== selectedLeave._id));
      setIsDeleteModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError("Failed to delete leave request");
      setLoading(false);
    }
  };

  const openViewModal = (leave) => {
    setSelectedLeave(leave);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (leave) => {
    setSelectedLeave(leave);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || leave.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-3 text-lg">Loading leave requests...</span>
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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search leaves..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-700 bg-white text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-500" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-700 bg-white text-gray-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 transition-colors shadow-md"
          >
            <FaPlus className="mr-2" />
            New Leave
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-[6px] border-blue-700 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Total Leaves
              </p>
              <p className="text-4xl font-bold mt-2 text-gray-900">
                {leaves.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">All time requests</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-full shadow-inner">
              <FaCalendarAlt className="text-blue-700 text-2xl" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (leaves.length / (leaves.length + 10)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-[6px] border-amber-600 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Pending
              </p>
              <p className="text-4xl font-bold mt-2 text-gray-900">
                {leaves.filter((l) => l.status === "pending").length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-full shadow-inner animate-pulse">
              <FaClock className="text-amber-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${
                  (leaves.filter((l) => l.status === "pending").length /
                    Math.max(1, leaves.length)) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-[6px] border-green-700 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Approved
              </p>
              <p className="text-4xl font-bold mt-2 text-gray-900">
                {leaves.filter((l) => l.status === "approved").length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Completed requests</p>
            </div>
            <div className="bg-green-50 p-4 rounded-full shadow-inner">
              <FaCheckCircle className="text-green-700 text-2xl" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{
                width: `${
                  (leaves.filter((l) => l.status === "approved").length /
                    Math.max(1, leaves.length)) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-800">
                      {leave.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {calculateLeaveDays(leave.startDate, leave.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {formatDate(leave.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openViewModal(leave)}
                        className="text-indigo-700 font-semibold text-sm hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                        title="View details"
                      >
                        View
                      </button>
                      <button
                        onClick={
                          leave.status === "pending"
                            ? () => openDeleteModal(leave)
                            : undefined
                        }
                        className={`p-2 rounded-full transition-colors ${
                          leave.status === "pending"
                            ? "text-red-700 hover:text-red-900 hover:bg-red-50 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          leave.status === "pending"
                            ? "Delete leave"
                            : "Cannot delete approved/rejected leave"
                        }
                        disabled={leave.status !== "pending"}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#05000fdc] backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all border border-gray-300">
            <div className="p-6 border-b border-gray-300 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaPlus className="mr-2 text-indigo-800" />
                New Leave Request
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitLeave} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-colors bg-white text-gray-800"
                  value={newLeave.leaveType}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, leaveType: e.target.value })
                  }
                  required
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-colors bg-white text-gray-800"
                    value={newLeave.startDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, startDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-colors bg-white text-gray-800"
                    value={newLeave.endDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, endDate: e.target.value })
                    }
                    min={
                      newLeave.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-colors bg-white text-gray-800"
                  rows="3"
                  value={newLeave.reason}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, reason: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 transition-colors flex items-center justify-center shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedLeave && (
        <div className="fixed inset-0 bg-[#05000fdc] backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-300 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Leave Details
                </h2>
                <div className="flex items-center mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedLeave.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : selectedLeave.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedLeave.status.toUpperCase()}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {calculateLeaveDays(
                      selectedLeave.startDate,
                      selectedLeave.endDate
                    )}{" "}
                    day(s)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-3">
                      <FaCalendarAlt className="text-blue-800 text-lg" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Leave Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {selectedLeave.leaveType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Period</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(selectedLeave.startDate)} to{" "}
                        {formatDate(selectedLeave.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Days</p>
                      <p className="font-medium text-gray-900">
                        {calculateLeaveDays(
                          selectedLeave.startDate,
                          selectedLeave.endDate
                        )}{" "}
                        day(s)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full mr-3">
                      <FaInfoCircle className="text-purple-800 text-lg" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Status Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Applied On</p>
                      <p className="font-medium text-gray-800">
                        {formatDateTime(selectedLeave.createdAt)}
                      </p>
                    </div>
                    {selectedLeave.updatedAt !== selectedLeave.createdAt && (
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-medium text-gray-800">
                          {formatDateTime(selectedLeave.updatedAt)}
                        </p>
                      </div>
                    )}
                    {selectedLeave.status === "rejected" &&
                      selectedLeave.rejectionReason && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Rejection Reason
                          </p>
                          <p className="font-medium text-gray-800">
                            {selectedLeave.rejectionReason}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-full mr-3">
                    <FaUser className="text-amber-700 text-lg" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Reason for Leave
                  </h3>
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="whitespace-pre-line text-gray-800">
                    {selectedLeave.reason}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <FaClock className="text-green-800 text-lg" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Leave Timeline
                  </h3>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-4 pl-10">
                    <div className="relative">
                      <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-blue-800 border-4 border-blue-100"></div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900">
                          Leave Request Submitted
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(selectedLeave.createdAt)}
                        </p>
                      </div>
                    </div>
                    {selectedLeave.status !== "pending" && (
                      <div className="relative">
                        <div
                          className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full ${
                          selectedLeave.status === 'approved' ? 'bg-green-800 border-green-100' : 'bg-red-800 border-red-100'
                        } border-4"
                        ></div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-900">
                            Request {selectedLeave.status}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(selectedLeave.updatedAt)}
                          </p>
                          {selectedLeave.status === "rejected" &&
                            selectedLeave.rejectionReason && (
                              <p className="text-sm mt-1 text-gray-600">
                                Reason:{" "}
                                <span className="font-medium text-gray-800">
                                  {selectedLeave.rejectionReason}
                                </span>
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-300">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                {selectedLeave.status === "pending" && (
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openDeleteModal(selectedLeave);
                    }}
                    className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors shadow-md"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedLeave && (
        <div className="fixed inset-0 bg-[#05000fdc] backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-300">
            <div className="p-6 border-b border-gray-300 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaTrash className="mr-2 text-red-700" />
                Confirm Deletion
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-4">
                Are you sure you want to delete this leave request for{" "}
                <span className="font-semibold text-gray-900">
                  {calculateLeaveDays(
                    selectedLeave.startDate,
                    selectedLeave.endDate
                  )}{" "}
                  day(s)
                </span>{" "}
                from {formatDate(selectedLeave.startDate)} to{" "}
                {formatDate(selectedLeave.endDate)}?
              </p>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLeave}
                  className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboardLeave;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaSearch, FaFilter } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const AdminManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSuppliers = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5002/laundry/api/suppliers/all",
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );

      if (response.data.success) {
        setSuppliers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch suppliers");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching suppliers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5002/laundry/api/updateSupplier/${id}`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(
          `Supplier ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
        fetchSuppliers();
      } else {
        toast.error(
          response.data.message || "Failed to update supplier status"
        );
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating supplier"
      );
    }
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  const formatItemName = (item) => {
    return item
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 relative max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Suppliers</h1>
        <div className="flex space-x-4">
          <Link
            to="/admin-dashboard/register-supplier"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 px-4 py-2 font-medium transition-colors shadow-md"
          >
            <FaPlus className="text-sm" />
            Add Supplier
          </Link>
          <button 
            onClick={fetchSuppliers}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 px-4 py-2 font-medium transition-colors"
          >
            <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search suppliers..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FaFilter className="text-gray-500 mr-2" />
              <select
                className="bg-transparent border-none outline-none text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{supplier.companyName}</div>
                      <div className="text-gray-500 text-sm">{supplier.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{supplier.contactPerson}</div>
                      <div className="text-gray-500 text-sm">{supplier.email}</div>
                      <div className="text-gray-500">{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {supplier.suppliedItems.map((item) => (
                          <span
                            key={item}
                            className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                          >
                            {formatItemName(item)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          supplier.status
                        )}`}
                      >
                        {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin-dashboard/edit-supplier/${supplier._id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        {supplier.status === "active" ? (
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to deactivate this supplier?"
                                )
                              ) {
                                handleStatusChange(supplier._id, "inactive");
                              }
                            }}
                            title="Deactivate"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:text-green-800 transition-colors"
                            onClick={() =>
                              handleStatusChange(supplier._id, "active")
                            }
                            title="Activate"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg">No suppliers found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filter</p>
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

export default AdminManageSuppliers;
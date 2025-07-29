import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { FiEdit, FiTrash2, FiUser, FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const AdminManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch: "",
    role: "employee",
    isActive: true,
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5002/laundry/api/branch/all"
      );
      setBranches(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const AdminToken = localStorage.getItem("AdminToken");
      const [employeesRes, branchesRes] = await Promise.all([
        axios.get("http://localhost:5002/laundry/api/users/all", {
          headers: { Authorization: `Bearer ${AdminToken}` }
        }),
        axios.get("http://localhost:5002/laundry/api/branch/all", {
          headers: { Authorization: `Bearer ${AdminToken}` }
        })
      ]);

      if (employeesRes.data.success && branchesRes.data.success) {
        const filteredEmployees = employeesRes.data.data.filter(user => 
          ["employee", "manager"].includes(user.role)
        );
        setEmployees(filteredEmployees);
        setBranches(branchesRes.data.data);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      employee.first_name?.toLowerCase().includes(searchTermLower) ||
      employee.last_name?.toLowerCase().includes(searchTermLower) ||
      employee.email?.toLowerCase().includes(searchTermLower) ||
      employee.phone?.toLowerCase().includes(searchTermLower) ||
      employee.role?.toLowerCase().includes(searchTermLower)
    );
  });

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      branch: employee.branch,
      role: employee.role,
      isActive: employee.isActive,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBranchChange = (selectedOption) => {
    setFormData({
      ...formData,
      branch: selectedOption.value
    });
  };

  const handleUpdateEmployee = async () => {
    try {
      const AdminToken = localStorage.getItem("AdminToken");
      const response = await axios.patch(
        `http://localhost:5002/laundry/api/employee-update/${selectedEmployee._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Employee updated successfully");
        fetchEmployees();
        setShowEditModal(false);
      } else {
        toast.error(response.data.message || "Failed to update employee");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating employee"
      );
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      const AdminToken = localStorage.getItem("AdminToken");
      const response = await axios.delete(
        `http://localhost:5002/laundry/api/deleteUser/${selectedEmployee._id}`,
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Employee deleted successfully");
        fetchEmployees();
        setShowDeleteModal(false);
      } else {
        toast.error(response.data.message || "Failed to delete employee");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting employee"
      );
    }
  };

  const branchOptions = branches.map(branch => ({
    value: branch._id,
    label: branch.branch_name,
    displayId: branch.address
  }));

  const currentBranch = branchOptions.find(
    option => option.value === formData.branch
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-5">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit {selectedEmployee.first_name}'s Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <Select
                  options={branchOptions}
                  value={currentBranch}
                  onChange={handleBranchChange}
                  placeholder="Select branch..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  getOptionLabel={option => `${option.label} (${option.displayId})`}
                  getOptionValue={option => option.value}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active Employee
                </label>
              </div>
            </div>
            
            <div className="border-t p-5 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-5">
              <h3 className="text-xl font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-gray-700">
                Are you sure you want to permanently delete{" "}
                {selectedEmployee.first_name} {selectedEmployee.last_name}? This
                action cannot be undone.
              </p>
            </div>

            <div className="border-t p-5 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">
            {employees.length} employees •{" "}
            {employees.filter((e) => e.isActive).length} active
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link
            to="/admin-dashboard/register-employee"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 font-medium transition-colors"
          >
            <FaPlus /> Add Employee
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {employee.first_name?.[0]}
                              {employee.last_name?.[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{employee.branch.slice(-6).toUpperCase() || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                            employee.role
                          )}`}
                        >
                          {employee.role.charAt(0).toUpperCase() +
                            employee.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            employee.isActive
                          )}`}
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditClick(employee)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FiEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(employee)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FiUser className="text-4xl mb-2 opacity-50" />
                        <p className="text-lg">No employees found</p>
                        <p className="text-sm mt-1">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "Add your first employee"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageEmployees;

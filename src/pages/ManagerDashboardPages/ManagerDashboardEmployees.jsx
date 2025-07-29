import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataContext";
import {
  FaUserTie,
  FaCalendarAlt,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaShoppingBag,
} from "react-icons/fa";

const ManagerDashboardEmployees = () => {
  const { users } = useContext(DataContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeOrders, setEmployeeOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const managerUser = users.manager;

  useEffect(() => {
    if (managerUser?.branch) {
      fetchEmployees(managerUser.branch);
    }
  }, [managerUser]);

  const fetchEmployees = async (branchId) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/users/branch/${branchId}/employees`,
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      setEmployees(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch employees");
      setLoading(false);
    }
  };

  const fetchEmployeeOrders = async (employeeId) => {
    const ManagerToken = localStorage.getItem("ManagerToken");
    try {
      setOrdersLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/orders/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${ManagerToken}`,
          },
        }
      );
      console.log(res);
      setEmployeeOrders(res.data.data);
      setOrdersLoading(false);
    } catch (err) {
      setError("Failed to fetch employee orders");
      setOrdersLoading(false);
    }
  };


  const openEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    fetchEmployeeOrders(employee._id);
    setIsModalOpen(true);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      `${employee.first_name} ${employee.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-3 text-lg">Loading employees...</span>
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
        <h1 className="text-3xl font-bold text-gray-800">
          Employee Management
        </h1>
        <div className="relative mt-4 md:mt-0 w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Orders</th> */}
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
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <FaUserTie className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {employee.first_name} {employee.last_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(employee.createdAt)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">
                        {employee.assignedOrders?.length || 0}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEmployeeDetails(employee)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold p-1 rounded-full hover:bg-blue-50"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No employees found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-[#000111ea] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b p-6 flex justify-between items-center">
              <div className="flex items-center">
                <FaUserTie className="text-blue-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Employee Details
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-700">
                    <FaUserTie className="mr-2 text-blue-500" /> Basic
                    Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {selectedEmployee.first_name}{" "}
                        {selectedEmployee.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedEmployee.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">
                        {selectedEmployee.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-700">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> Employment
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Date Joined</p>
                      <p className="font-medium">
                        {formatDate(selectedEmployee.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">
                        {selectedEmployee._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-700">
                  <FaShoppingBag className="mr-2 text-blue-500" /> Assigned
                  Orders
                </h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      statusFilter === "all"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All Orders
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      statusFilter === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setStatusFilter("processing")}
                  >
                    In Progress
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      statusFilter === "finished"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setStatusFilter("finished")}
                  >
                    Completed
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <FaSpinner className="animate-spin text-2xl text-blue-600" />
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employeeOrders
                          .filter(
                            (order) =>
                              statusFilter === "all" ||
                              order.status === statusFilter
                          )
                          .map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                #{order._id.slice(-6).toUpperCase()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.user?.first_name}{" "}
                                {order.user?.last_name || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.items.reduce(
                                  (acc, item) => acc + item.quantity,
                                  0
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                ₦{order.total_price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === "finished"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {order.status === "finished"
                                    ? "Completed"
                                    : order.status === "processing"
                                    ? "In Progress"
                                    : "Not Started"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {formatDateTime(order.updatedAt)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex w-full bottom-20 bg-white justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboardEmployees;

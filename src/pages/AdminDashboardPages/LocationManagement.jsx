import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const LocationManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDetails, setBranchDetails] = useState({
    revenue: 0,
    customers: [],
    employees: [],
    orders: [],
  });
  const [modalLoading, setModalLoading] = useState(false);

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

  const fetchBranchDetails = async (branchId) => {
    try {
      const AdminToken = localStorage.getItem("AdminToken");
      setModalLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
          "Content-Type": "application/json",
        },
      };
      const [customersRes, employeesRes, ordersRes] = await Promise.all([
        axios.get(
          `http://localhost:5002/laundry/api/users/branch/${branchId}/customers`,
          config
        ),
        axios.get(
          `http://localhost:5002/laundry/api/users/branch/${branchId}/employees`,
          config
        ),
        axios.get(
          `http://localhost:5002/laundry/api/order/all/${branchId}`,
          config
        ),
      ]);

      const paidOrders = ordersRes.data.data.filter((o) => o.is_paid);

      setBranchDetails({
        revenue: paidOrders.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0
        ),
        customers: customersRes.data.data || [],
        employees: employeesRes.data.data || [],
        orders: ordersRes.data.data || [],
      });
    } catch (error) {
      toast.error("Failed to fetch branch details");
      console.log(error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBranchClick = async (branch) => {
    setSelectedBranch(branch);
    await fetchBranchDetails(branch._id);
  };

  const handleStatusToggle = async (branchId, currentStatus) => {
    const AdminToken = localStorage.getItem("AdminToken");

    const config = {
      headers: {
        Authorization: `Bearer ${AdminToken}`,
        "Content-Type": "application/json",
      },
    };
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.patch(
        `http://localhost:5002/laundry/api/branch/${branchId}/status`,
        { status: newStatus },
        config
      );
      toast.success(
        `Branch ${newStatus === "active" ? "activated" : "deactivated"}`
      );
      fetchBranches();
      if (selectedBranch && selectedBranch._id === branchId) {
        setSelectedBranch({ ...selectedBranch, status: newStatus });
      }
    } catch (error) {
      toast.error("Failed to update branch status");
    }
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch?.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch?._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-900">
            Branch Locations
          </h2>
          <Link
            to="/admin-dashboard/add-branch"
            className="px-6 py-2 bg-indigo-800 text-white rounded-lg shadow hover:bg-indigo-900 transition-colors"
          >
            Add New Branch
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search branches..."
                  className="w-full pl-10 pr-4 outline-none py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="text-gray-500">
                {filteredBranches.length}{" "}
                {filteredBranches.length === 1 ? "branch" : "branches"} found
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Branch Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 border-1- border-gray-100">
                    {filteredBranches.length > 0 ? (
                      filteredBranches.map((branch) => (
                        <tr
                          key={branch._id}
                          className="hover:bg-indigo-50 transition-colors cursor-pointer"
                          onClick={() => handleBranchClick(branch)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #Branch_{branch._id.slice(-4).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                            {branch.branch_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {branch.city}, {branch.state}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {branch.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                branch.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {branch.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No branches match your search term
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

      {selectedBranch && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white flex items-center justify-between p-3 border-b-1 border-gray-300 sticky top-0 z-50">
              <h1 className="text-3xl font-semibold">Branch details</h1>
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-900">
                    {selectedBranch.branch_name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedBranch.address}, {selectedBranch.city},{" "}
                    {selectedBranch.state}
                  </p>
                </div>
              </div>

              {modalLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">
                        Total Revenue
                      </h4>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(branchDetails.revenue)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="text-sm font-medium text-green-800 mb-1">
                        Customers
                      </h4>
                      <p className="text-2xl font-bold text-green-900">
                        {branchDetails.customers.length}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h4 className="text-sm font-medium text-purple-800 mb-1">
                        Employees
                      </h4>
                      <p className="text-2xl font-bold text-purple-900">
                        {branchDetails.employees.length}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <h4 className="text-sm font-medium text-orange-800 mb-1">
                        Orders
                      </h4>
                      <p className="text-2xl font-bold text-orange-900">
                        {branchDetails.orders.length}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-lg mb-3 text-gray-800">
                        Recent Customers
                      </h4>
                      <div className="space-y-3">
                        {branchDetails.customers.slice(0, 5).map((customer) => (
                          <div
                            key={customer._id}
                            className="flex items-center space-x-3"
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-800 font-medium">
                                {customer.first_name?.[0]}
                                {customer.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {customer.first_name} {customer.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        ))}
                        {branchDetails.customers.length === 0 && (
                          <p className="text-gray-500 text-sm">
                            No customers found
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-lg mb-3 text-gray-800">
                        Employees
                      </h4>
                      <div className="space-y-3">
                        {branchDetails.employees.slice(0, 5).map((employee) => (
                          <div
                            key={employee._id}
                            className="flex items-center space-x-3"
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-800 font-medium">
                                {employee.first_name?.[0]}
                                {employee.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {employee.role}
                              </p>
                            </div>
                          </div>
                        ))}
                        {branchDetails.employees.length === 0 && (
                          <p className="text-gray-500 text-sm">
                            No employees found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleStatusToggle(
                          selectedBranch._id,
                          selectedBranch.status
                        )
                      }
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedBranch.status === "active"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {selectedBranch.status === "active"
                        ? "Deactivate Branch"
                        : "Activate Branch"}
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      {selectedBranch.status === "active"
                        ? "Deactivating will prevent new orders from being placed at this location"
                        : "Activating will allow orders to be placed at this location"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;

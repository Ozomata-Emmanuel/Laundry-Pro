import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import axios from 'axios';
import { FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const ManagerDashboardHeader = () => {
  const { user } = useContext(DataContext);
  const [branch, setBranch] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orders, setOrders] = useState([]);
  const hasUnassignedOrders = orders.some(order => !order.assigned_employee_id);


  const fetchOrders = async (branchId) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/order/all/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const employeesRes = await axios.get(
        `http://localhost:5002/laundry/api/users/branch/${branchId}/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const employeesMap = employeesRes.data.data.reduce((acc, employee) => {
        acc[employee._id] = employee;
        return acc;
      }, {});

      const ordersWithEmployees = res.data.data.map((order) => {
        if (order.assigned_employee_id) {
          return {
            ...order,
            employee: employeesMap[order.assigned_employee_id] || null,
          };
        }
        return order;
      });
      setOrders(ordersWithEmployees);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const fetchBranch = async (branchId) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5002/laundry/api/branch/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(res.data.success){
        setBranch(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching branch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.branch) {
      fetchBranch(user.branch);
      fetchOrders(user.branch);
    }
  }, [user]);


  return (
    <header className="h-13 flex items-center z-50 bg-white w-full shadow-lg sticky top-0">
      <div className="flex items-center w-full justify-between h-16 px-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <span className="text-blue-800">Laundry</span> Pro
          </h1>
          {!loading && branch && (
            <div className="ml-8 hidden md:block">
              <span className="text-sm text-gray-500">Branch:</span>
              <span className="ml-2 font-medium text-gray-700">
                {branch.branch_name || 'N/A'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
            <FaBell className="text-xl" />
            {hasUnassignedOrders && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserCircle className="text-blue-600 text-xl" />
              </div>
              <span className="hidden md:inline-block font-medium text-gray-700">
                {user?.first_name || 'Manager'}
              </span>
              <FaChevronDown className={`text-gray-500 duration-150 transition-transform ${showDropdown ? 'transform rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-50 border-1 border-gray-200 hover:bg-gray-100 rounded-md shadow-lg py-1 z-50">
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700  hover:text--600"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerDashboardHeader;
import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiPackage, 
  FiUsers, 
  FiTruck, 
  FiFileText, 
  FiSettings, 
  FiLogOut,
  FiTrendingUp,
  FiClipboard,
  FiUserPlus 
} from "react-icons/fi";
import { FaCodeBranch } from "react-icons/fa";
import { RiInboxUnarchiveLine } from "react-icons/ri";

import { toast } from "react-toastify";

const AdminDashboardSideBar = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const navItems = [
    { path: "/admin-dashboard/overview", name: "Overview", icon: <FiHome className="h-5 w-5" /> },
    { path: "/admin-dashboard/inventory", name: "Inventory", icon: <FiPackage className="h-5 w-5" /> },
    { path: "/admin-dashboard/order-management", name: "Orders", icon: <FiClipboard className="h-5 w-5" /> },
    { path: "/admin-dashboard/manage-employees", name: "Employees", icon: <FiUsers className="h-5 w-5" /> },
    { path: "/admin-dashboard/manage-suppliers", name: "Suppliers", icon: <FiTruck className="h-5 w-5" /> },
    { path: "/admin-dashboard/register-employee", name: "Add Employee", icon: <FiUserPlus className="h-5 w-5" /> },
    { path: "/admin-dashboard/register-supplier", name: "Add Supplier", icon: <FiUserPlus className="h-5 w-5" /> },
    { path: "/admin-dashboard/manage-locations", name: "Branches", icon: <FaCodeBranch className="h-5 w-5" /> },
    { path: "/admin-dashboard/reports", name: "Reports", icon: <FiTrendingUp className="h-5 w-5" /> },
    { path: "/admin-dashboard/employee-requests", name: "Employee Requests", icon: <RiInboxUnarchiveLine className="h-5 w-5" /> },
    
    // { path: "/admin-dashboard/settings", name: "Settings", icon: <FiSettings className="h-5 w-5" /> },
  ];


  const handleLogout = () => {
    localStorage.removeItem("laundry_admin_id");
    localStorage.removeItem("AdminToken");
    toast.success("Signed out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate("/");
  };

  return (
    <div className="hidden lg:fixed z-10 lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:bg-gradient-to-r lg:from-indigo-900 lg:to-blue-950 lg:pb-6 shadow-xl border-r border-blue-800">
      <div className="py-5 border-b-2 border-blue-800 mb-5">
        <div className="text-center text-3xl text-blue-50 w-full">
          <h1 className="font-semibold" style={{ fontFamily: "'Bauhaus 93', sans-serif" }}>
            Laundry Pro
          </h1>
        </div>
      </div>

      <div className="h-full overflow-x-hidden">
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 roundd-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-[#2f2b82] to-[#736fbe] text-white '
                  : 'text-blue-100 hover:bg-[#5820b1] hover:bg-opacity-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-4 mt-auto">
        <div className="border-t border-blue-500">
          <button
            className="flex w-full pt-4 hover:animate-pulse pb-2 items-center text-blue-100 hover:text-white cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSideBar;
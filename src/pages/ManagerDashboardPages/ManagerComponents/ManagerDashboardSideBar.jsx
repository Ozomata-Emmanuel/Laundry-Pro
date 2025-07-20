import React from "react";
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
} from "react-icons/fi";
import { FaCodeBranch } from "react-icons/fa";
import { toast } from "react-toastify";

const ManagerDashboardSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const navItems = [
    {
      path: "/manager-dashboard/overview",
      name: "Overview",
      icon: <FiHome className="h-5 w-5" />,
    },
    {
      path: "/manager-dashboard/orders",
      name: "Orders",
      icon: <FiClipboard className="h-5 w-5" />,
    },
    {
      path: "/manager-dashboard/manage-employees",
      name: "Employees",
      icon: <FiUsers className="h-5 w-5" />,
    },
    // {
    // path: "/manager-dashboard/inventory",
    // name: "Inventory",
    //   icon: <FiPackage className="h-5 w-5" />,
    // },
    // {
    //   path: "/manager-dashboard/reports",
    //   name: "Reports",
    //   icon: <FiTrendingUp className="h-5 w-5" />,
    // },
    // { path: "/admin-dashboard/manage-suppliers", name: "Suppliers", icon: <FiTruck className="h-5 w-5" /> },
    // { path: "/admin-dashboard/register-supplier", name: "Add Supplier", icon: <FiClipboard className="h-5 w-5" /> },
    // { path: "/admin-dashboard/manage-locations", name: "Branches", icon: <FaCodeBranch className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("laundry_manager_id");
    localStorage.removeItem("ManagerToken");
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
    <div className="hidden lg:fixed z-10 lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:bg-indigo-900 lg:pb-6 shadow-xl">
      <div className="py-5 mb-5">
        <div className="text-center text-3xl text-blue-50 w-full">
          <h1
            className="font-semibold"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
          >
            Laundry Pro
          </h1>
        </div>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-8 py-4 roundd-lg transition-colors ${
              location.pathname === item.path
                ? "bg-gradient-to-r from-[#0400554d] via-[#0400554d]  to-[#08027500] text-white "
                : "text-blue-100 hover:text-blue-800 hover:bg-blue-300 hover:bg-opacity-50"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

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

export default ManagerDashboardSideBar;

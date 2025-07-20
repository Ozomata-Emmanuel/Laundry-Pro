import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiPackage,
  FiLogOut,
  FiClipboard
} from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";

import { PiSuitcaseSimple } from "react-icons/pi";
<PiSuitcaseSimple />
import { toast } from "react-toastify";

const EmployeeDashboardSiderbar = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const navItems = [
    { path: "/employee-dashboard/overview", name: "Overview", icon: <FiHome className="h-5 w-5" /> },
    { path: "/employee-dashboard/assigned-orders", name: "Orders", icon: <FiClipboard className="h-5 w-5" /> },
    { path: "/employee-dashboard/leave", name: "Leave request", icon: <PiSuitcaseSimple className="h-5 w-5" /> },
    { path: "/employee-dashboard/inventory", name: "Inventory request", icon: <MdOutlineInventory2  className="h-5 w-5" /> },
  ];


  const handleLogout = () => {
    localStorage.removeItem("laundry_user_id");
    localStorage.removeItem("EmployeeToken");
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

      <nav className="flex-1 ">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-8 py-4 roundd-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-[#7600fd] to-[#8f8bd8] text-white '
                : 'text-blue-100 hover:bg-[#6800df] hover:bg-opacity-50'
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
  )
}

export default EmployeeDashboardSiderbar
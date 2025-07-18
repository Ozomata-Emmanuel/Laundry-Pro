import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiPackage, FiTruck, FiFileText, FiSettings, FiLogOut } from "react-icons/fi";
import { AiOutlineAppstore } from "react-icons/ai";
import { toast } from "react-toastify";

const SupplierDashboardSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/supplier-dashboard/overview", name: "Overview", icon: <FiHome className="h-5 w-5" /> },
    { path: "/supplier-dashboard/inventory", name: "Inventory", icon: <AiOutlineAppstore className="h-5 w-5" /> },
    { path: "/supplier-dashboard/order", name: "Orders", icon: <FiPackage className="h-5 w-5" /> },
    { path: "/supplier-dashboard/delivery", name: "Delivery", icon: <FiTruck className="h-5 w-5" /> },
    { path: "/supplier-dashboard/invoice", name: "Invoices", icon: <FiFileText className="h-5 w-5" /> },
    { path: "/supplier-dashboard/setting", name: "Settings", icon: <FiSettings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    toast.success("Signed out successfully");
    navigate('/')
  };

  return (
    <div className="hidden lg:fixed z-10 lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:bg-gradient-to-br lg:from-blue-800 lg:to-blue-900 lg:pb-6 shadow-xl border-r border-blue-800">
      <div className="py-5 border-b-2 border-blue-500 mb-10">
        <div className="text-center text-3xl text-blue-50 w-full">
          <h1 className="font-semibold" style={{ fontFamily: "'Bauhaus 93', sans-serif" }}>
            Laundry Pro
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-blue-100 hover:bg-blue-500 hover:bg-opacity-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <div className="border-t border-blue-500">
          <div
            className="flex pt-4 hover:animate-pulse pb-2 items-center text-blue-100 hover:text-white cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardSideBar;

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FaUser,
  FaEdit,
  FaHistory,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBox,
  FaPrint,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaCalendarAlt,
  FaReceipt,
  FaListAlt,
} from "react-icons/fa";
import { GiGems } from "react-icons/gi";
import { FaGem, FaCrown, FaMedal, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataContext } from "../../context/DataContext";
import PrintableReceipt from "../../components/PrintableReceipt";
import { toast } from "react-toastify";
import Select from "react-select";

const Profile = () => {
  const { user } = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printFrameRef = useRef(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    branch: user.branch,
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);
  const userID = user?.id;
  const branchOptions = [];

  useEffect(() => {
    const fetchData = async () => {
      if (!userID) return;

      try {
        const [ordersRes, branchesRes] = await Promise.all([
          axios.get(`http://localhost:5002/laundry/api/orders/user/${userID}`),
          axios.get("http://localhost:5002/laundry/api/branch/all"),
        ]);
        const branchOptions = branchesRes.data.data.map((branch) => ({
          value: branch._id,
          label: `${branch.branch_name}, ${branch.city}, ${branch.state}, ${branch.address}`,
        }));
        setOrders(ordersRes.data.data);
        setBranches(branchOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  const points = orders.length * 20;

  const MemberBadge = ({ points }) => {
    const badgeData = {
      diamond: {
        text: "Diamond",
        icon: <FaGem className="text-purple-400 mr-1" />,
        color: "text-purple-500",
        threshold: 1000,
      },
      platinum: {
        text: "Platinum",
        icon: <FaCrown className="text-gray-300 mr-1" />,
        color: "text-gray-400",
        threshold: 400,
      },
      gold: {
        text: "Gold",
        icon: <FaMedal className="text-yellow-400 mr-1" />,
        color: "text-yellow-500",
        threshold: 200,
      },
      silver: {
        text: "Silver",
        icon: <FaAward className="text-gray-300 mr-1" />,
        color: "text-gray-300",
        threshold: 100,
      },
      bronze: {
        text: "Bronze",
        icon: <FaStar className="text-amber-600 mr-1" />,
        color: "text-amber-700",
        threshold: 0,
      },
    };

    const getBadge = () => {
      if (points >= badgeData.diamond.threshold) return badgeData.diamond;
      if (points >= badgeData.platinum.threshold) return badgeData.platinum;
      if (points >= badgeData.gold.threshold) return badgeData.gold;
      if (points >= badgeData.silver.threshold) return badgeData.silver;
      return badgeData.bronze;
    };

    const badge = getBadge();

    return (
      <span className={`${badge.color} flex items-center`}>
        {badge.icon}
        {badge.text} Member
      </span>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      branch: selectedOption.value,
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5002/laundry/api/user/${user.id}`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          branch: formData.branch,
          ...(formData.newPassword && { password: formData.newPassword }),
        }
      );
      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          password: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setShowPasswordFields(false);
        toast.success("Settings updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);

      if (error.response.data.message) {
        toast.error(`Update failed: ${error.response.data.message}`);
      } else {
        toast.error("An unexpected error occurred while updating settings.");
      }
    }
  };

  const handlePrint = () => {
    const printContent = printFrameRef.current.innerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page { size: auto; margin: 10mm; }
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .print-content {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
            }
            .bg-indigo-600 { background-color: #4f46e5 !important; }
            .bg-blue-600 { background-color: #2563eb !important; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const selectedBranch = branches.find((b) => b._id === user.branch);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 bg-indigo-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-indigo-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
      {selectedOrder && (
        <div className="fixed inset-0 bg-[#00010fe0] backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                <FaReceipt className="mr-2" /> Order Receipt
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div style={{ display: "none" }}>
              <PrintableReceipt
                ref={printFrameRef}
                order={selectedOrder}
                user={user}
                branch={selectedBranch}
              />
            </div>

            <div className="p-6">
              <div
                ref={receiptRef}
                className="p-6 print-content bg-white rounded-lg border border-gray-200"
              >
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-lg mb-4 shadow-md">
                    <h1 className="text-3xl font-bold tracking-wide">
                      LAUNDRY PRO
                    </h1>
                    <p className="text-indigo-100 mt-1">
                      123 Clean Street, Fresh City
                    </p>
                    <p className="text-indigo-100 text-sm mt-1">
                      (555) 123-4567
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center justify-center">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                      <FaUser className="mr-2" /> CUSTOMER
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-800 font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaPhone className="mr-2 text-sm" /> {user.phone}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-2 text-sm" /> {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <FaBox className="mr-2" /> ORDER DETAILS
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-800 capitalize">
                        <span className="font-medium">Status:</span>{" "}
                        {selectedOrder.status}
                      </p>
                      <p className="text-gray-600 capitalize">
                        <span className="font-medium">Payment:</span>{" "}
                        {selectedOrder.payment_type}
                      </p>
                      {selectedBranch && (
                        <p className="text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-sm" />{" "}
                          {selectedBranch.branch_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-lg text-indigo-800 mb-3 flex items-center">
                    <FaListAlt className="mr-2" /> ITEMS
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-indigo-100">
                        <tr>
                          <th className="text-left py-3 px-4 text-indigo-800 font-medium">
                            Service
                          </th>
                          <th className="text-right py-3 px-4 text-indigo-800 font-medium">
                            Qty
                          </th>
                          <th className="text-right py-3 px-4 text-indigo-800 font-medium">
                            Price
                          </th>
                          <th className="text-right py-3 px-4 text-indigo-800 font-medium">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-200 hover:bg-indigo-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-800">
                              {item.name}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">
                              ₦{item.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-800 font-medium">
                              ₦{(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end mb-6">
                  <div className="text-right space-y-3">
                    <div className="flex justify-between w-64">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ₦{selectedOrder.total_price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between w-64 border-t-2 border-gray-300 pt-3">
                      <span className="text-lg font-semibold text-indigo-800">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-indigo-800">
                        ₦{selectedOrder.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-200">
                  <p className="mb-1">Thank you for your business!</p>
                  <p>We appreciate your trust in our services</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end shadow-inner">
              <button
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <FaPrint className="mr-2" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 w-full md:w-auto">
            <h1 className="text-3xl font-bold text-indigo-900">My Dashboard</h1>
            <p className="text-indigo-600 mt-2 flex items-center">
              <span>Welcome back, </span>
              <span className="font-medium ml-1">{user.first_name}</span>
              <span className="ml-2 flex items-center">
                <MemberBadge points={orders.length * 20} />
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-[#ffffffb4] p-4 rounded-xl shadow-sm flex items-center border border-indigo-100 hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-1 rounded-full mr-3">
                <GiGems className="text-indigo-600 text-3xl" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-semibold">
                  Laundry Points
                </p>
                <p className="font-bold text-indigo-900 text-xl">
                  {points} <span className="text-sm font-normal">points</span>
                </p>
              </div>
            </div>
            <div className="bg-[#ffffffb4] p-4 rounded-xl shadow-sm flex items-center border border-indigo-100 hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-3 rounded-full mr-3">
                <FaBox className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-semibold">
                  Total Orders
                </p>
                <p className="font-bold text-indigo-900 text-xl">
                  {orders.length}
                </p>
              </div>
            </div>
            <div className="bg-[#ffffffb4] p-4 rounded-xl shadow-sm flex items-center border border-indigo-100 hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-green-100 to-teal-100 p-3 rounded-full mr-3">
                <FaHistory className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-green-900 font-semibold">
                  Completed
                </p>
                <p className="font-bold text-green-900 text-xl">
                  {orders.filter((o) => o.status === "finished").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100">
              <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-indigo-500 mt-1">
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full text-left flex items-center p-4 rounded-lg transition-colors ${
                        activeTab === "orders"
                          ? "bg-indigo-100 text-indigo-700 font-medium shadow-inner"
                          : "hover:bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      <div
                        className={`mr-3 p-2 rounded-lg ${
                          activeTab === "orders"
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        <FaBox />
                      </div>
                      <div>
                        <p className="font-medium">My Orders</p>
                        <p className="text-xs text-indigo-500">
                          {orders.length} orders
                        </p>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full text-left flex items-center p-4 rounded-lg transition-colors ${
                        activeTab === "profile"
                          ? "bg-indigo-100 text-indigo-700 font-medium shadow-inner"
                          : "hover:bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      <div
                        className={`mr-3 p-2 rounded-lg ${
                          activeTab === "profile"
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        <FaUser />
                      </div>
                      <div>
                        <p className="font-medium">Profile Settings</p>
                        <p className="text-xs text-indigo-500">
                          Manage account
                        </p>
                      </div>
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="p-4 border-t border-indigo-100">
                <Link
                  to="/order"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors shadow-md"
                >
                  <FaEdit className="mr-2" /> Place New Order
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {activeTab === "orders" ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-100">
                <div className="border-b border-indigo-100 p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-semibold text-indigo-900 mb-2 md:mb-0">
                      My Order History
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-indigo-600">Filter:</span>
                      <select className="text-sm border border-indigo-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>All Orders</option>
                        <option>Completed</option>
                        <option>In Progress</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <FaBox className="text-indigo-400 text-3xl" />
                      </div>
                      <h3 className="text-lg font-medium text-indigo-800 mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-indigo-500 mb-6 max-w-md mx-auto">
                        You haven't placed any orders yet. Get started by
                        placing your first laundry order!
                      </p>
                      <Link
                        to="/order"
                        className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all hover:shadow-lg"
                      >
                        Place Your First Order
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-indigo-100">
                        <thead className="bg-indigo-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                              Order #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-indigo-100">
                          {orders.map((order) => (
                            <tr
                              key={order._id}
                              className="hover:bg-indigo-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                #{order._id.slice(-6).toUpperCase()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800">
                                <div className="flex items-center">
                                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                                    {order.items.reduce(
                                      (sum, item) => sum + item.quantity,
                                      0
                                    )}
                                  </span>
                                  items
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "finished"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-indigo-100 text-indigo-800"
                                  }`}
                                >
                                  {order.status === "finished"
                                    ? "Completed"
                                    : order.status === "processing"
                                    ? "In Progress"
                                    : "Pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800 text-right font-medium">
                                ₦{order.total_price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-end w-full"
                                >
                                  <FaReceipt className="mr-1" /> View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Profile Settings Section */
              <div className="bg-white rounded-xl shadow-sm -hidden border border-indigo-100">
                <div className="border-b border-indigo-100 p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <h2 className="text-xl font-semibold text-indigo-900">
                    Account Settings
                  </h2>
                  <p className="text-indigo-600 mt-1">
                    Manage your personal information and preferences
                  </p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSettingsSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <FaUser className="mr-2 text-indigo-500" /> First
                            Name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 outline-none border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <FaEnvelope className="mr-2 text-indigo-500" />{" "}
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 outline-none border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-indigo-500" />{" "}
                            Nearest Branch
                          </label>
                          <Select
                            options={branches}
                            onChange={handleAddressChange}
                            value={branchOptions.find(
                              (option) => option.value === formData.branch
                            )}
                            placeholder="Select your nearest branch"
                            required
                            className="w-full react-select-container"
                            classNamePrefix="react-select"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                outline: "none",
                                padding: "2px 4px", 
                                minHeight: "44px",
                                borderRadius: "0.5rem",
                                borderColor: state.isFocused
                                  ? "#6366f1"
                                  : "#c7d2fe",
                                boxShadow: state.isFocused
                                  ? "0 0 0 2px rgba(99, 102, 241, 0.5)"
                                  : "none", 
                                transition: "all 0.2s ease-in-out",
                                backgroundColor: "#fff",
                                "&:hover": {
                                  borderColor: "#6366f1",
                                },
                              }),
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <FaUser className="mr-2 text-indigo-500" /> Last
                            Name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 outline-none border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-indigo-700 mb-1 flex items-center">
                            <FaPhone className="mr-2 text-indigo-500" /> Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 outline-none border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordFields(!showPasswordFields)
                        }
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
                      >
                        {showPasswordFields ? (
                          <>
                            <FaChevronUp className="mr-2" /> Hide Password
                            Settings
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="mr-2" /> Change Password
                          </>
                        )}
                      </button>

                      {showPasswordFields && (
                        <div className="mt-4 space-y-4 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                          <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
                            <FaLock className="mr-2" /> Password Settings
                          </h3>
                          <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              placeholder="Enter current password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        className="px-6 py-2 border border-indigo-200 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

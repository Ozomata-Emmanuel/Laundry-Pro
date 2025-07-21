import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTshirt, FaPlus, FaTimes, FaBoxes, FaExclamationTriangle, FaTags, FaBell } from 'react-icons/fa';
import { toast } from "react-toastify";

const AdminInventoryDashboard = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Cleaning',
    currentStock: 0,
    reorderLevel: 1,
    unit: 'pieces',
    supplier: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const statusColors = {
    Critical: "bg-red-100 text-red-800 border-l-4 border-red-500",
    Low: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    Adequate: "bg-green-100 text-green-800 border-l-4 border-green-500",
    High: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
  };

  const categories = [
    "Cleaning",
    "Packaging",
    "Personal Care",
    "Linens",
    "Other"
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async (e) => {
    e.preventDefault();
    const AdminToken = localStorage.getItem("AdminToken");
    const errors = {};
    if (!newItem.name) errors.name = 'Name is required';
    if (newItem.currentStock < 0) errors.currentStock = 'Stock cannot be negative';
    if (newItem.reorderLevel < 1) errors.reorderLevel = 'Reorder level must be at least 1';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/laundry/api/inventory', newItem, {
        headers: {
          Authorization: `Bearer ${AdminToken}`
        }
      });
      
      setInventoryItems([...inventoryItems, response.data.data]);
      setShowAddItemModal(false);
      setNewItem({
        name: '',
        category: 'Cleaning',
        currentStock: 0,
        reorderLevel: 1,
        unit: 'pieces',
        supplier: ''
      });
      setFormErrors({});
      toast.success("Item added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === 'currentStock' || name === 'reorderLevel' ? Number(value) : value
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const AdminToken = localStorage.getItem("AdminToken");
      try {
        setIsLoading(true);
        setError(null);
        
        const config = {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
            "Content-Type": "application/json",
          },
        };
        const [inventoryRes, suppliersRes] = await Promise.all([
          axios.get("http://localhost:5002/laundry/api/inventory", config),
          axios.get("http://localhost:5002/laundry/api/suppliers/all", config),
        ]);
        
        setInventoryItems(inventoryRes.data?.data || []);
        setSuppliers(suppliersRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setInventoryItems([]);
        setSuppliers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestItems = async (items) => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      const response = await axios.post("http://localhost:5002/laundry/api/reorder/requests", {
        supplier: selectedSupplierId,
        items: items.map(item => ({
          name: item.name,
          category: item.category,
          quantity: item.reorderLevel * 2 - item.currentStock,
          unit: item.unit
        }))
      },
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
          },
        }
      );
      // /laundry/api/reorder/requests/:id/fulfill

      setShowRequestModal(false);
      setSelectedItems([]);
      setSelectedSupplierId('');

      fetchInventoryData();
      toast.success(`Inventory request sent`)
    } catch (err) {
      toast.error(`error sending inventory request`)
      setError(err.response?.data?.message || 'Failed to submit reorder request');
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryData = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5002/laundry/api/inventory', {
        headers: {
          Authorization: `Bearer ${AdminToken}`
        }
      });
      setInventoryItems(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md rounded-lg shadow-sm">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaBoxes className="text-blue-600" />
              Inventory Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Track and manage your inventory levels</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowAddItemModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <FaPlus />
              Add New Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBoxes className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Items</h3>
              <p className="text-2xl font-bold mt-1">{inventoryItems.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Low Stock</h3>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {inventoryItems.filter(item => item.status === 'Low' || item.status === 'Critical').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaTags className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
              <p className="text-2xl font-bold mt-1">
                {[...new Set(inventoryItems.map((item) => item.category))].length}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaBell className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Need Reorder</h3>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {inventoryItems.filter(item => item.currentStock <= item.reorderLevel).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const percentage =
                      (item.currentStock / (item.reorderLevel * 2)) * 100;
                    const progressColor =
                      item.status === "Critical"
                        ? "bg-red-500"
                        : item.status === "Low"
                        ? "bg-yellow-500"
                        : "bg-green-500";

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaTshirt className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">{item.unit}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {item.currentStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {item.reorderLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full mr-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${progressColor}`}
                                  style={{
                                    width: `${Math.min(100, percentage)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No items found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              Stock Alerts
            </h3>
            <div className="space-y-3">
              {inventoryItems
                .filter(
                  (item) => item.status === "Low" || item.status === "Critical"
                )
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Only {item.currentStock} {item.unit} remaining (Reorder at {item.reorderLevel})
                      </p>
                    </div>
                    <button
                      className="text-sm bg-white text-red-600 px-3 py-1 rounded-md border border-red-200 hover:bg-red-100 transition"
                      onClick={() => {
                        setSelectedItems([item]);
                        setShowRequestModal(true);
                      }}
                    >
                      Reorder
                    </button>
                  </div>
                ))}
              {inventoryItems.filter(item => item.status === "Low" || item.status === "Critical").length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>No stock alerts at this time</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FaTags className="text-blue-500" />
              Categories Summary
            </h3>
            <div className="space-y-4">
              {categories.map(category => {
                const count = inventoryItems.filter(item => item.category === category).length;
                if (count === 0) return null;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-medium">{count} items</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showRequestModal && (
          <div className="fixed inset-0 bg-[#07020fee] backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Request Items</h3>
                <button 
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.companyName} ({supplier.contactPerson})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Items to Order</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {selectedItems.map(item => (
                    <div key={item._id} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.reorderLevel * 2 - item.currentStock} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
                    !selectedSupplierId ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleRequestItems(selectedItems)}
                  disabled={!selectedSupplierId}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddItemModal && (
          <div className="fixed inset-0 bg-[#07020fee] backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add New Item</h3>
                <button 
                  onClick={() => {
                    setShowAddItemModal(false);
                    setFormErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleAddItem}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter item name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                      <select
                        name="category"
                        value={newItem.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit*</label>
                      <select
                        name="unit"
                        value={newItem.unit}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pieces">Pieces</option>
                        <option value="liters">Liters</option>
                        <option value="kg">Kilograms</option>
                        <option value="boxes">Boxes</option>
                        <option value="units">Units</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock*</label>
                      <input
                        type="number"
                        name="currentStock"
                        min="0"
                        value={newItem.currentStock}
                        onChange={handleInputChange}
                        className={`w-full p-2 border outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.currentStock ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.currentStock && <p className="text-red-500 text-xs mt-1">{formErrors.currentStock}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level*</label>
                      <input
                        type="number"
                        name="reorderLevel"
                        min="1"
                        value={newItem.reorderLevel}
                        onChange={handleInputChange}
                        className={`w-full p-2 border outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.reorderLevel ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.reorderLevel && <p className="text-red-500 text-xs mt-1">{formErrors.reorderLevel}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select
                      name="supplier"
                      value={newItem.supplier}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddItemModal(false);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventoryDashboard;
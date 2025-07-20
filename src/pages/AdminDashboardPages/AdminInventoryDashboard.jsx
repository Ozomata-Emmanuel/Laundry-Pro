import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTshirt, FaPlus, FaTimes } from 'react-icons/fa';
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
  const statusColors = {
    Critical: "bg-red-600 text-white",
    Low: "bg-red-100 text-red-800",
    Adequate: "bg-green-100 text-green-800",
    High: "bg-blue-100 text-blue-800",
  };


  const handleAddItem = async (e) => {
    e.preventDefault();
    const AdminToken = localStorage.getItem("AdminToken");
    // Basic validation
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
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

  // Add request function
  const handleRequestItems = async (items) => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      const response = await axios.post("http://localhost:5002/laundry/api/requests", {
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

      setShowRequestModal(false);
      setSelectedItems([]);
      setSelectedSupplierId('');

      // Optionally refresh inventory data
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
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h1>
            <p className="text-gray-600 mt-2">Track and manage your inventory levels</p>
          </div>
          <button 
            onClick={() => setShowAddItemModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Items</h3>
            <p className="text-2xl font-bold mt-1">{inventoryItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Low Stock</h3>
            <p className="text-2xl font-bold mt-1 text-red-600">
              {inventoryItems.filter(item => item.status === 'Low' || item.status === 'Critical').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
            <p className="text-2xl font-bold mt-1">
              {[...new Set(inventoryItems.map((item) => item.category))].length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Need Reorder</h3>
            <p className="text-2xl font-bold mt-1 text-yellow-600">
              {inventoryItems.filter(item => item.currentStock <= item.reorderLevel).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Item Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Current Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reorder Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => {
                  const percentage =
                    (item.currentStock / (item.reorderLevel * 2)) * 100;
                  const progressColor =
                    item.status === "Critical"
                      ? "bg-red-600"
                      : item.status === "Low"
                      ? "bg-yellow-500"
                      : "bg-green-500";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {item.reorderLevel} {item.unit}
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
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Stock Alerts
            </h3>
            <ul className="space-y-3">
              {inventoryItems
                .filter(
                  (item) => item.status === "Low" || item.status === "Critical"
                )
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Only {item.currentStock} {item.unit} remaining
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
                  </li>
                ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex flex-col items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-sm font-medium">Add Item</span>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition flex flex-col items-center">
                <svg
                  className="w-6 h-6 text-green-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span className="text-sm font-medium">Import</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex flex-col items-center">
                <svg
                  className="w-6 h-6 text-purple-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="text-sm font-medium">Export</span>
              </button>
              <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition flex flex-col items-center">
                <svg
                  className="w-6 h-6 text-yellow-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="text-sm font-medium">Bulk Edit</span>
              </button>
            </div>
          </div>
        </div>
        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-[#04000ccc] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Request Items from Supplier</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select 
                  className="w-full p-2 border rounded-md"
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
                <h4 className="font-medium mb-2">Selected Items</h4>
                <ul className="space-y-2">
                  {selectedItems.map(item => (
                    <li key={item._id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.reorderLevel * 2 - item.currentStock} {item.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                  onClick={() => handleRequestItems(selectedItems)}
                  disabled={!selectedSupplierId || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddItemModal && (
          <div className="fixed inset-0 bg-[#00010cdc] backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add New Inventory Item</h3>
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
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      name="category"
                      value={newItem.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Cleaning">Cleaning</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Linens">Linens</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Current Stock Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock*</label>
                    <input
                      type="number"
                      name="currentStock"
                      min="0"
                      value={newItem.currentStock}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${formErrors.currentStock ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.currentStock && <p className="text-red-500 text-xs mt-1">{formErrors.currentStock}</p>}
                  </div>

                  {/* Reorder Level Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level*</label>
                    <input
                      type="number"
                      name="reorderLevel"
                      min="1"
                      value={newItem.reorderLevel}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${formErrors.reorderLevel ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.reorderLevel && <p className="text-red-500 text-xs mt-1">{formErrors.reorderLevel}</p>}
                  </div>

                  {/* Unit Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit*</label>
                    <select
                      name="unit"
                      value={newItem.unit}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="pieces">Pieces</option>
                      <option value="liters">Liters</option>
                      <option value="kg">Kilograms</option>
                      <option value="boxes">Boxes</option>
                      <option value="units">Units</option>
                    </select>
                  </div>

                  {/* Supplier Field (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select
                      name="supplier"
                      value={newItem.supplier}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
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

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddItemModal(false);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

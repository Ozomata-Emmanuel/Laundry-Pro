import React, { useState } from 'react';

const AdminInventoryDashboard = () => {

  const inventoryItems = [
    { 
      id: 1, 
      name: 'Eco-Friendly Detergent', 
      category: 'Cleaning', 
      currentStock: 42, 
      reorderLevel: 50, 
      unit: 'liters',
      status: 'Low'
    },
    { 
      id: 2, 
      name: 'Fabric Softener', 
      category: 'Cleaning', 
      currentStock: 85, 
      reorderLevel: 30, 
      unit: 'liters',
      status: 'Adequate'
    },
    { 
      id: 3, 
      name: 'Plastic Hangers', 
      category: 'Packaging', 
      currentStock: 120, 
      reorderLevel: 50, 
      unit: 'pieces',
      status: 'Adequate'
    },
    { 
      id: 4, 
      name: 'Bamboo Toothbrushes', 
      category: 'Personal Care', 
      currentStock: 210, 
      reorderLevel: 100, 
      unit: 'pieces',
      status: 'High'
    },
    { 
      id: 5, 
      name: 'Organic Cotton Towels', 
      category: 'Linens', 
      currentStock: 15, 
      reorderLevel: 25, 
      unit: 'pieces',
      status: 'Critical'
    }
  ];


  const statusColors = {
    'Critical': 'bg-red-600 text-white',
    'Low': 'bg-red-100 text-red-800',
    'Adequate': 'bg-green-100 text-green-800',
    'High': 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h1>
            <p className="text-gray-600 mt-2">Track and manage your inventory levels</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200">
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
              {[...new Set(inventoryItems.map(item => item.category))].length}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => {
                  const percentage = (item.currentStock / (item.reorderLevel * 2)) * 100;
                  const progressColor = 
                    item.status === 'Critical' ? 'bg-red-600' :
                    item.status === 'Low' ? 'bg-yellow-500' :
                    'bg-green-500';
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.name}</div>
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
                                style={{ width: `${Math.min(100, percentage)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
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
            <h3 className="text-lg font-medium text-gray-800 mb-4">Stock Alerts</h3>
            <ul className="space-y-3">
              {inventoryItems
                .filter(item => item.status === 'Low' || item.status === 'Critical')
                .map(item => (
                  <li key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Only {item.currentStock} {item.unit} remaining</p>
                    </div>
                    <button className="text-sm bg-white text-red-600 px-3 py-1 rounded-md border border-red-200 hover:bg-red-100 transition">
                      Reorder
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex flex-col items-center">
                <svg className="w-6 h-6 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">Add Item</span>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition flex flex-col items-center">
                <svg className="w-6 h-6 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="text-sm font-medium">Import</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex flex-col items-center">
                <svg className="w-6 h-6 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-sm font-medium">Export</span>
              </button>
              <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition flex flex-col items-center">
                <svg className="w-6 h-6 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Bulk Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryDashboard;
import React, { useState } from 'react';

const SupplierOrderManagement = () => {
  const orders = [
    { id: 'ORD-2023-001', date: '2023-10-15', items: ['Eco-Friendly Detergent', 'Fabric Softener'], quantity: [20, 15], status: 'Delivered', total: '$450.00' },
    { id: 'ORD-2023-002', date: '2023-10-12', items: ['Stain Remover', 'Bleach'], quantity: [30, 10], status: 'Shipped', total: '$320.00' },
    { id: 'ORD-2023-003', date: '2023-10-10', items: ['Dry Cleaning Solvent'], quantity: [25], status: 'Processing', total: '$375.00' },
    { id: 'ORD-2023-004', date: '2023-10-08', items: ['Eco-Friendly Detergent', 'Fabric Softener', 'Stain Remover'], quantity: [15, 10, 20], status: 'Pending', total: '$525.00' },
    { id: 'ORD-2023-005', date: '2023-10-05', items: ['Bleach', 'Dry Cleaning Solvent'], quantity: [15, 20], status: 'Cancelled', total: '$400.00' }
  ];

  const [selectedStatus, setSelectedStatus] = useState('All');
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = selectedStatus === 'All' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Order
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-blue-600">{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between max-w-xs">
                        <span>{item}</span>
                        <span className="text-gray-500">{order.quantity[index]} units</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  {order.status === 'Pending' && (
                    <button className="text-green-600 hover:text-green-900">Process</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-100">Previous</button>
          <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierOrderManagement;
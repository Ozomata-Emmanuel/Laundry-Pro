import React, { useState } from 'react';

const SupplierInvoiceManagement = () => {
  const invoices = [
    { id: 'INV-2023-001', date: '2023-10-15', orderId: 'ORD-2023-001', amount: '$450.00', status: 'Paid', dueDate: '2023-10-30' },
    { id: 'INV-2023-002', date: '2023-10-12', orderId: 'ORD-2023-002', amount: '$320.00', status: 'Paid', dueDate: '2023-10-27' },
    { id: 'INV-2023-003', date: '2023-10-10', orderId: 'ORD-2023-003', amount: '$375.00', status: 'Pending', dueDate: '2023-10-25' },
    { id: 'INV-2023-004', date: '2023-10-08', orderId: 'ORD-2023-004', amount: '$525.00', status: 'Overdue', dueDate: '2023-10-18' },
    { id: 'INV-2023-005', date: '2023-10-05', orderId: 'ORD-2023-005', amount: '$400.00', status: 'Cancelled', dueDate: '2023-10-20' }
  ];

  const [selectedStatus, setSelectedStatus] = useState('All');
  const statuses = ['All', 'Paid', 'Pending', 'Overdue', 'Cancelled'];

  const filteredInvoices = selectedStatus === 'All' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === selectedStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalAmount = (status) => {
    if (status === 'All') {
      return invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '')), 0);
    } else {
      return invoices
        .filter(invoice => invoice.status === status)
        .reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '')), 0);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoice Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
          <p className="text-2xl font-bold">{invoices.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Paid</h3>
          <p className="text-2xl font-bold">${getTotalAmount('Paid').toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold">${getTotalAmount('Pending').toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
          <p className="text-2xl font-bold">${getTotalAmount('Overdue').toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
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
          Create Invoice
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-blue-600">{invoice.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.orderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  invoice.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  {invoice.dueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  {invoice.status === 'Pending' && (
                    <button className="text-green-600 hover:text-green-900">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} invoices
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-100">Previous</button>
          <button className="px-3 py-1 border rounded-md text-gray-700 bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierInvoiceManagement;
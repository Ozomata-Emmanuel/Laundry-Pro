import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart,
  FaHistory,
  FaPrint,
  FaSearch,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaBox
} from 'react-icons/fa';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredOrders = mockOrders.filter(order => 
    order.id.toString().includes(searchTerm) || 
    order.itemsList.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction.orderId.toString().includes(searchTerm)
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case 'In Progress':
        return <FaSpinner className="text-blue-500 mr-1 animate-spin" />;
      default:
        return <FaClock className="text-yellow-500 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className=" text-[000980] p-4 shadow-inner">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Customer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-[#0BA5C6] flex items-center justify-center">
              <span className="font-bold">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'current' ? 'text-[#0BA5C6] border-b-2 border-[#0BA5C6]' : 'text-gray-600'}`}
          >
            <FaBox className="mr-2" />
            Current Orders
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'history' ? 'text-[#0BA5C6] border-b-2 border-[#0BA5C6]' : 'text-gray-600'}`}
          >
            <FaHistory className="mr-2" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 font-medium flex items-center ${activeTab === 'transactions' ? 'text-[#0BA5C6] border-b-2 border-[#0BA5C6]' : 'text-gray-600'}`}
          >
            <FaShoppingCart className="mr-2" />
            Transactions
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'transactions' ? 'transactions' : 'orders'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-[#0BA5C6] focus:border-[#0BA5C6]"
            />
          </div>
        </div>

        {activeTab === 'current' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#000980] mb-6">Your Current Orders</h2>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any current orders.</p>
                <button
                  onClick={() => navigate('/new-order')}
                  className="mt-4 bg-[#0BA5C6] hover:bg-[#098fb4] text-white px-4 py-2 rounded-lg"
                >
                  Place a New Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-[#000980]">Order #{order.id}</h3>
                        <p className="text-gray-500">{order.date}</p>
                        <div className="mt-2 flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="font-medium">{order.status}</span>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium">Items:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {order.itemsList.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        <div className="mt-4 space-x-2">
                          <button
                            onClick={() => navigate(`/reorder/${order.id}`)}
                            className="bg-[#0BA5C6] hover:bg-[#098fb4] text-white px-3 py-1 rounded text-sm"
                          >
                            Re-order
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm flex items-center"
                          >
                            <FaPrint className="mr-1" /> Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#000980] mb-6">Your Order History</h2>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No order history found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#000980]">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.itemsList.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/reorder/${order.id}`)}
                            className="text-[#0BA5C6] hover:text-[#098fb4] mr-3"
                          >
                            Re-order
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <FaPrint className="mr-1" /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#000980] mb-6">Your Transactions</h2>
            
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#000980]">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{transaction.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => window.print()}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <FaPrint className="mr-1" /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner, FaCheck, FaTimes, FaTruck, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';

const SupplierOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    const supplierId = localStorage.getItem('supplier_id');
    const supplierToken = localStorage.getItem('supplierToken');
    
    if (!supplierId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5002/laundry/api/reorder/requests/all/${supplierId}`,
        {
          headers: {
            Authorization: `Bearer ${supplierToken}`,
          },
        }
      );
      
      let filteredOrders = response.data.data;
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const supplierToken = localStorage.getItem('supplierToken');
    
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5002/laundry/api/reorder/requests/${orderId}/fulfill`,
        {
          headers: {
            Authorization: `Bearer ${supplierToken}`,
          },
        }
      );
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Approved</span>;
      case 'fulfilled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Fulfilled</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'partially_fulfilled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Partially Fulfilled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaTruck className="text-blue-600" />
          Order Management
        </h1>
        <div className="mt-4 md:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="partially_fulfilled">Partially Fulfilled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && !orders.length ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
          <span>Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <FaBoxOpen className="mx-auto text-3xl text-blue-400 mb-2" />
          <p className="text-gray-600">No orders found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">#{order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map(item => (
                          <div key={item._id} className="flex items-center">
                            <span className="font-medium mr-2">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-sm text-gray-500">+{order.items.length - 2} more items</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {order.status === 'approved' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'fulfilled')}
                            disabled={loading}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FaCheck className="mr-1" /> Fulfill
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order._id, 'partially_fulfilled')}
                            disabled={loading}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Partial
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaInfoCircle className="mr-1" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>{getStatusBadge(selectedOrder.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested On</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested By</p>
                  <p className="font-medium">
                    {selectedOrder.requestedBy?.first_name || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.quantity}x {item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <p className="text-sm">{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, 'fulfilled');
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Mark as Fulfilled
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, 'partially_fulfilled');
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Partial Fulfillment
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierOrderManagement;
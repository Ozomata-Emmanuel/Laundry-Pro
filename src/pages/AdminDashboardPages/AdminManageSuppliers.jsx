import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/laundry/api/suppliers/all", {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
        },
      });
      
      if (response.data.success) {
        setSuppliers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch suppliers");
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error(error.response?.data?.message || "An error occurred while fetching suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5002/laundry/api/updateSupplier/${id}`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(`Supplier ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchSuppliers();
      } else {
        toast.error(response.data.message || "Failed to update supplier status");
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error(error.response?.data?.message || "An error occurred while updating supplier");
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  };

  const formatItemName = (item) => {
    return item
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Manage Suppliers
      </h1>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Company</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Contact</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Supplies</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {supplier.companyName}
                    </td>
                    <td className="px-6 py-4 text-gray-700 space-y-1">
                      <div>{supplier.contactPerson}</div>
                      <div className="text-gray-400 text-sm">{supplier.email}</div>
                      <div>{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {supplier.suppliedItems.map(item => (
                          <span
                            key={item}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {formatItemName(item)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(supplier.status)}`}>
                        {supplier.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          className="text-indigo-600 hover:underline font-medium"
                          onClick={() => console.log('Edit', supplier._id)}
                        >
                          Edit
                        </button>
                        {supplier.status === 'active' ? (
                          <button
                            className="text-red-600 hover:underline font-medium"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to deactivate this supplier?')) {
                                handleStatusChange(supplier._id, 'inactive');
                              }
                            }}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:underline font-medium"
                            onClick={() => handleStatusChange(supplier._id, 'active')}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageSuppliers;
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const AdminRegisterSupplier = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    suppliedItems: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      suppliedItems: checked
        ? [...prev.suppliedItems, value]
        : prev.suppliedItems.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.suppliedItems.length === 0) {
      alert('Please select at least one supplied item');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        'http://localhost:5002/laundry/api/suppliers/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if(response.data.success){
        toast.success("Supplier registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          suppliedItems: []
        });
      } else {
        toast.error(resp.data.message || "An error occured while registering the Supplier", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error)
      toast.error(error || "An error occured while registering the Supplier", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { id: 'detergent', label: 'Detergent' },
    { id: 'fabric_softener', label: 'Fabric Softener' },
    { id: 'bleach', label: 'Bleach' },
    { id: 'hangers', label: 'Hangers' },
    { id: 'packaging', label: 'Packaging Materials' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Register Supplier
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. CleanSupplies Ltd"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. john@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="e.g. 08012345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplied Items <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <label key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="suppliedItems"
                    value={item.id}
                    checked={formData.suppliedItems.includes(item.id)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
            {formData.suppliedItems.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one item.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || formData.suppliedItems.length === 0}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
              loading || formData.suppliedItems.length === 0
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Registering...' : 'Register Supplier'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterSupplier;

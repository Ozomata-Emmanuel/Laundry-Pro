import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiGitBranch, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminRegisterEmployee = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    branch: '',
    role: 'employee'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      branch: selectedOption.value,
    }));
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const AdminToken = localStorage.getItem("AdminToken");
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/laundry/api/branch/all", {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
        },
      });
      const branchOptions = response.data.data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name
      }));
      setBranches(branchOptions);
    } catch (error) {
      toast.error('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const AdminToken = localStorage.getItem("AdminToken");
      
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const employee = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        branch: formData.branch,
        role: formData.role
      };

      const response = await axios.post(
        'http://localhost:5002/laundry/api/users/register',
        employee,
        {
          headers: {
            Authorization: `Bearer ${AdminToken}`,
            'Content-Type': 'application/json',
          }
        }
      )

      if (response.data.success) {
        toast.success("User registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          branch: '',
          role: 'employee'
        });
      } else {
        toast.error(response.data.message || "An error occurred while registering the user", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred while registering the user", {
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

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-indigo-800 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">
            Register New User
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            Fill in the details to create a new user account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-indigo-600" />
                First Name <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jane"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-indigo-600" />
                Last Name <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiMail className="mr-2 text-indigo-600" />
              Email <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g. jane@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiPhone className="mr-2 text-indigo-600" />
              Phone Number <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 08012345678"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiGitBranch className="mr-2 text-indigo-600" />
              Branch <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="w-full">
              <Select
                options={branches}
                onChange={handleBranchChange}
                value={branches.find(
                  (option) => option.value === formData.branch
                )}
                placeholder="Select branch"
                required
                className="react-select-container border-1 border-gray-200 rounded-lg"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    backgroundColor: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
                    },
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#e5e7eb" : "white",
                    color: "#111827",
                  }),
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBriefcase className="mr-2 text-indigo-600" />
              Role <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
              <FiBriefcase className="absolute left-3 top-3.5 text-gray-400" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiLock className="mr-2 text-indigo-600" />
              Password <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiLock className="mr-2 text-indigo-600" />
              Confirm Password <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-all duration-200 shadow-md`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterEmployee;
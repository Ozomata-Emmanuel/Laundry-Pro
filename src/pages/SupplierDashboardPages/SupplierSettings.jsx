import React, { useState } from 'react';

const SupplierSettings = () => {
  const [supplierInfo, setSupplierInfo] = useState({
    companyName: "CleanFabrics Inc.",
    contactPerson: "John Smith",
    email: "john@cleanfabrics.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fabric Street, Suite 100",
    city: "Textile City",
    state: "TC",
    zipCode: "12345",
    country: "United States",
    taxId: "TAX-123456789",
    paymentTerms: "Net 30",
    preferredCurrency: "USD"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    paymentReminders: true,
    newsletter: false
  });

  const handleSupplierInfoChange = (e) => {
    const { name, value } = e.target;
    setSupplierInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSupplierInfo = (e) => {
    e.preventDefault();
    alert('Supplier information saved successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Supplier Settings</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <form onSubmit={handleSaveSupplierInfo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={supplierInfo.companyName}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={supplierInfo.contactPerson}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={supplierInfo.email}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={supplierInfo.phone}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={supplierInfo.address}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={supplierInfo.city}
                    onChange={handleSupplierInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={supplierInfo.state}
                    onChange={handleSupplierInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={supplierInfo.zipCode}
                    onChange={handleSupplierInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={supplierInfo.country}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                <input
                  type="text"
                  name="taxId"
                  value={supplierInfo.taxId}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select
                  name="paymentTerms"
                  value={supplierInfo.paymentTerms}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Currency</label>
                <select
                  name="preferredCurrency"
                  value={supplierInfo.preferredCurrency}
                  onChange={handleSupplierInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="orderUpdates"
                name="orderUpdates"
                checked={notifications.orderUpdates}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="orderUpdates" className="ml-2 block text-sm text-gray-700">
                Order Updates
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="deliveryAlerts"
                name="deliveryAlerts"
                checked={notifications.deliveryAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="deliveryAlerts" className="ml-2 block text-sm text-gray-700">
                Delivery Alerts
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paymentReminders"
                name="paymentReminders"
                checked={notifications.paymentReminders}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="paymentReminders" className="ml-2 block text-sm text-gray-700">
                Payment Reminders
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={notifications.newsletter}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                Newsletter and Promotions
              </label>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => alert('Notification preferences saved!')}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierSettings;
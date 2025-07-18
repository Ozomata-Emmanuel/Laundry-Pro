import React from 'react';

const SupplierDashboardOverview = () => {
  const supplierOverview = {
    name: "CleanFabrics Inc.",
    contactPerson: "John Smith",
    email: "john@cleanfabrics.com",
    phone: "+1 (555) 123-4567",
    accountStatus: "Active",
    rating: 4.8,
    totalOrders: 47,
    pendingDeliveries: 3,
    recentActivity: [
      { date: "2023-10-15", activity: "New detergent shipment delivered" },
      { date: "2023-10-10", activity: "Invoice #INV-2023-456 paid" },
      { date: "2023-10-05", activity: "Placed order for fabric softeners" }
    ]
  };

  const performanceMetrics = [
    { name: "On-Time Delivery", value: 80, unit: "%" },
    { name: "Product Quality", value: 4.7, unit: "/5" },
    { name: "Response Time", value: 2.1, unit: "hours" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Supplier Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Supplier Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {supplierOverview.name}</p>
            <p><span className="font-medium">Contact:</span> {supplierOverview.contactPerson}</p>
            <p><span className="font-medium">Email:</span> {supplierOverview.email}</p>
            <p><span className="font-medium">Phone:</span> {supplierOverview.phone}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-600">{supplierOverview.accountStatus}</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{metric.name}</span>
                  <span>{metric.value}{metric.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(metric.value / (metric.unit === '%' ? 100 : 5)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{supplierOverview.totalOrders}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-lg">
              <p className="text-sm text-gray-600">Pending Deliveries</p>
              <p className="text-2xl font-bold">{supplierOverview.pendingDeliveries}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <p className="text-sm text-gray-600">Supplier Rating</p>
              <p className="text-2xl font-bold">{supplierOverview.rating}/5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {supplierOverview.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">{activity.activity}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardOverview;
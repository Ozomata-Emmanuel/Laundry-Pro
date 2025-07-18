import React from 'react';

const SupplierDeliveryTracking = () => {
  const deliveries = [
    { id: 'DLV-2023-001', orderId: 'ORD-2023-001', date: '2023-10-15', items: ['Eco-Friendly Detergent', 'Fabric Softener'], status: 'Delivered', trackingNumber: 'TRK123456789', carrier: 'FedEx' },
    { id: 'DLV-2023-002', orderId: 'ORD-2023-002', date: '2023-10-14', items: ['Stain Remover', 'Bleach'], status: 'In Transit', trackingNumber: 'TRK987654321', carrier: 'UPS' },
    { id: 'DLV-2023-003', orderId: 'ORD-2023-003', date: '2023-10-12', items: ['Dry Cleaning Solvent'], status: 'Processing', trackingNumber: 'TRK456789123', carrier: 'DHL' },
    { id: 'DLV-2023-004', orderId: 'ORD-2023-004', date: '2023-10-10', items: ['Eco-Friendly Detergent', 'Fabric Softener', 'Stain Remover'], status: 'Scheduled', trackingNumber: 'TRK321654987', carrier: 'FedEx' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Scheduled', completed: false },
      { name: 'Processing', completed: false },
      { name: 'In Transit', completed: false },
      { name: 'Delivered', completed: false }
    ];
    
    if (status === 'Scheduled') {
      steps[0].completed = true;
    } else if (status === 'Processing') {
      steps[0].completed = true;
      steps[1].completed = true;
    } else if (status === 'In Transit') {
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
    } else if (status === 'Delivered') {
      steps.forEach(step => step.completed = true);
    }
    
    return steps;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Delivery Tracking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delivery #{delivery.id}</h3>
                  <p className="text-sm text-gray-500">For Order: {delivery.orderId}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {delivery.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Carrier Information</h4>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Carrier:</span> {delivery.carrier}</p>
                  <p><span className="font-medium">Tracking #:</span> {delivery.trackingNumber}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Status</h4>
                <div className="mt-2">
                  <div className="flex items-center">
                    {getStatusSteps(delivery.status).map((step, index) => (
                      <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step.completed ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-xs mt-1 ${step.completed ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                            {step.name}
                          </span>
                        </div>
                        {index < getStatusSteps(delivery.status).length - 1 && (
                          <div className={`flex-1 h-1 mx-1 ${step.completed ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Delivery Date: {delivery.date}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDeliveryTracking;
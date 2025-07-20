import axios from "axios";
import { useEffect, useState } from "react";

const AdminFulfillmentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get('http://localhost:5002/api/employee-requests?status=approved');
      setRequests(res.data);
      setIsLoading(false);
    };
    fetchRequests();
  }, []);

  const handleFulfill = async (requestId) => {
    try {
      await axios.put(`http://localhost:5002/api/employee-requests/${requestId}/fulfill`);
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      console.error('Fulfillment failed:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Pending Employee Requests</h2>
      
      {isLoading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests pending fulfillment</p>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request._id} className="border p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">Request #{request._id.slice(-6)}</h3>
                  <p>Order: {request.order.orderNumber}</p>
                  <p>Employee: {request.employee.name}</p>
                </div>
                <button
                  onClick={() => handleFulfill(request._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Mark as Fulfilled
                </button>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium">Items Requested:</h4>
                <ul className="list-disc pl-5 mt-2">
                  {request.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.inventoryItem.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFulfillmentDashboard

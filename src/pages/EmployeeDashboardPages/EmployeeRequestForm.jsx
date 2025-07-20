import React, { useState } from 'react';
import axios from 'axios';

const EmployeeRequestForm = ({ order }) => {
  const [items, setItems] = useState([{ inventoryItem: '', quantity: 1 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5002/api/employee-requests', {
        orderId: order._id,
        items: items.filter(item => item.inventoryItem && item.quantity > 0)
      });
      // Show success message
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Request Items for Order #{order.orderNumber}</h3>
      
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-3">
            <select
              value={item.inventoryItem}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].inventoryItem = e.target.value;
                setItems(newItems);
              }}
              className="flex-1 p-2 border rounded"
              required
            >
              <option value="">Select Item</option>
              {availableItems.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name} (Stock: {item.currentStock})
                </option>
              ))}
            </select>
            
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = parseInt(e.target.value);
                setItems(newItems);
              }}
              className="w-20 p-2 border rounded"
              required
            />
            
            <button
              type="button"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="bg-red-500 text-white px-3 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setItems([...items, { inventoryItem: '', quantity: 1 }])}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Add Another Item
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRequestForm

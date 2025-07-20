import React from 'react';

const PrintableReceipt = React.forwardRef(({ order, user, branch }, ref) => (
  <div ref={ref} className="p-6">
    <style>{`
      @page { 
        size: auto; 
        margin: 5mm; 
      }
      @media print {
        body { 
          margin: 0; 
          padding: 0;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          background: white !important;
        }
        .receipt-container {
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          padding: 15px;
          border: 1px solid #e2e8f0;
          position: relative;
        }
        .watermark {
          position: absolute;
          opacity: 0.1;
          font-size: 72px;
          color: #3b82f6;
          transform: rotate(-60deg);
          z-index: -1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-55deg);
          white-space: nowrap;
          font-weight: bold;
          pointer-events: none;
        }
        .header {
          border-bottom: 2px dashed #e2e8f0;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .section-title {
          letter-spacing: 0.5px;
          font-size: 13px;
          text-transform: uppercase;
        }
        .receipt-table {
          border-collapse: collapse;
          width: 100%;
        }
        .receipt-table th {
          text-align: left;
          padding: 8px 5px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          font-size: 12px;
        }
        .receipt-table td {
          padding: 8px 5px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }
        .total-row {
          font-weight: 600;
        }
        .text-muted {
          color: #64748b !important;
        }
        .text-dark {
          color: #1e293b !important;
        }
        .text-primary {
          color: #3b82f6 !important;
        }
        .bg-light {
          background-color: #f8fafc62 !important;
        }
        .bg-lightblue {
          background-color: #f8fafc !important;
        }
        .border-light {
          border-color: #f1f5f9 !important;
        }
        .rounded-sm {
          border-radius: 0.25rem !important;
        }
        .text-xs {
          font-size: 12px !important;
        }
        .text-sm {
          font-size: 13px !important;
        }
        .text-base {
          font-size: 14px !important;
        }
        .font-semibold {
          font-weight: 600 !important;
        }
        .py-2 {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
        .px-3 {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
        .p-3 {
          padding: 10px;
        }
      }
    `}</style>

    <div className="receipt-container">
      <div className="watermark ">LAUNDRY PRO</div>
      
      <div className="header text-center">
        <h1 className="text-xl font-bold text-primary mb-1">LAUNDRY PRO</h1>
        <p className="text-muted text-xs">123 Clean Street, Fresh City</p>
        <p className="text-muted text-xs">(555) 123-4567</p>
        
        <div className="mt-4">
          <p className="text-dark font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-muted text-xs">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-light p-3 rounded-sm">
          <h3 className="section-title text-muted mb-2">Customer</h3>
          <p className="text-dark text-sm">{user.first_name} {user.last_name}</p>
          <p className="text-muted text-xs">{user.phone}</p>
          <p className="text-muted text-xs">{user.email}</p>
        </div>

        <div className="bg-light p-3 rounded-sm">
          <h3 className="section-title text-muted mb-2">Order Details</h3>
          <p className="text-dark text-sm capitalize">{order.status}</p>
          <p className="text-muted text-xs capitalize">{order.payment_type} Payment</p>
          {branch && (
            <p className="text-muted text-xs">{branch.branch_name}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="section-title text-muted mb-2">Items</h3>
        <table className="receipt-table">
          <thead>
            <tr>
              <th className="text-left">Service</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="text-dark">{item.name}</td>
                <td className="text-muted text-right">{item.quantity}</td>
                <td className="text-muted text-right">₦{item.price.toFixed(2)}</td>
                <td className="text-dark text-right font-semibold">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right mb-6">
        <div className="flex justify-between py-2 px-3">
          <span className="text-muted">Subtotal:</span>
          <span className="text-dark">₦{order.total_price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-lightblue rounded-sm">
          <span className="text-dark font-semibold">Total:</span>
          <span className="text-primary font-semibold">
            ₦{order.total_price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="text-center text-muted text-xs border-t border-light pt-4">
        <p className="mb-1">Thank you for your business!</p>
        <p>Receipt ID: {order._id.slice(-12).toUpperCase()}</p>
      </div>
    </div>
  </div>
));

export default PrintableReceipt;
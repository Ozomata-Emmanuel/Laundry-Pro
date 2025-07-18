import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const StripePaymentForm = ({ total, orderData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setCardError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {

      const orderResponse = await axios.post(
        'http://localhost:5002/laundry/api/order/create',
        orderData
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { clientSecret } = orderResponse.data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: orderData.user_name || 'Customer', 
          },
        }
      });

      if (error) {
        if (error.code === 'incomplete_number') {
          setCardError('Please enter a complete card number');
        } else if (error.code === 'incomplete_cvc') {
          setCardError('Please enter a complete CVC code');
        } else if (error.code === 'incomplete_expiry') {
          setCardError('Please enter a complete expiration date');
        } else if (error.code === 'invalid_number') {
          setCardError('The card number is invalid');
        } else if (error.code === 'invalid_expiry') {
          setCardError('The expiration date is invalid');
        } else if (error.code === 'invalid_cvc') {
          setCardError('The CVC code is invalid');
        } else {
          setCardError(error.message || 'Payment failed');
        }
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (!cardError) {
        onError(error.message || 'Payment processing failed');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#e53e3e',
              },
            },
          }} 
          onChange={(e) => {
            if (e.error) {
              setCardError(e.error.message);
            } else {
              setCardError(null);
            }
          }}
        />
      </div>
      
      {cardError && (
        <div className="text-red-600 text-sm mt-2 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {cardError}
        </div>
      )}

      <button 
        onClick={handleSubmit}
        type="submit" 
        disabled={!stripe || processing}
        className={`w-full py-3 text-white rounded-lg transition-colors ${
          processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : `Pay $${(total / 100).toFixed(2)}`}
      </button>
    </div>
  );
};

export default StripePaymentForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineClose } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('failed');
  const [error, setError] = useState('');

  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setStatus('verifying');
    setError('');

    try {
      const response = await axios.post('http://localhost:5002/laundry/api/users/verify-account', { code });
      
      if (response.data.success) {
        setStatus('verified');
        setTimeout(() => navigate('/auth'), 2000);
      } else {
        setStatus('failed');
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setStatus('failed');
      setError(err.response?.data?.message || 'An error occurred during verification');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <FaEnvelope className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {status !== 'verified' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full px-4 outline-none py-3 text-center text-xl font-semibold tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456"
                  maxLength={6}
                  autoFocus
                  disabled={status === 'verifying'}
                />
                {code.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCode('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 cursor-pointer hover:text-gray-600"
                  >
                    <MdOutlineClose />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className={`flex items-center justify-center text-sm ${error.includes('sent!') ? 'text-green-600' : 'text-red-600'}`}>
                {error.includes('sent!') ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'verifying' || code.length !== 6}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-white font-medium transition-colors
                ${(status === 'verifying' || code.length !== 6) 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {status === 'verifying' ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Verification Successful!</h3>
            <p className="text-gray-600 mb-6">You'll be redirected shortly</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-2000 ease-linear" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}

        {status !== 'verified' && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Didn't receive a code?{' '}
            <button 
              onClick={()=> navigate('/resend-verification-code')}
              className="text-blue-600 font-medium hover:text-blue-500 disabled:opacity-50"
            >
              Resend code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
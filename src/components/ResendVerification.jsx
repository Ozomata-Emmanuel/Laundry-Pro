import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5002/laundry/api/users/resend-verification",
        { email }
      );
      
      setSubmitted(true);
      toast.success("Verification email has been resent successfully");
      navigate('/verify-email')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while resending the verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Resend Verification Email</h2>
          <p className="text-gray-600 mt-2">
            {submitted 
              ? "Please check your inbox for the verification link" 
              : "Enter your email address to resend the verification email"}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your registered email"
                required
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">
              Verification email has been sent to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Already verified?{" "}
          <Link to="/auth" className="text-blue-600 hover:underline font-medium">
            Log in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResendVerification;
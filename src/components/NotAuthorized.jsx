import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate()


  return (
    <div className="flex flex-col top-0 absolute z-50 w-full items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl z-50 font-bold text-red-600">403</h1>
        <p className="mt-4 z-50 text-xl text-gray-700">You don't have permission to access this page</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 z-50 inline-block px-6 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
    </div>
  );
}

export default NotAuthorized

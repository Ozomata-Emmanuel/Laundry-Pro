import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate()


  return (
    <div className="flex flex-col top-0 absolute z-50 pb-30 w-full items-center justify-center h-screen bg-[#f8f5f2]">
      <img src="/403_unauthorized_beaver.png" className='w-100' alt="" />
      <p className="mt-4 z-50 text-3xl text-gray-700 animate-bounce">You don't have permission to access this page</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 z-50 font-semibold text-4xl uppercase inline-block px-6 py-2 text-[#f1f4f5] bg-[#5ca9db] hover:bg-[#3f89c2] rounded-3xl cursor-pointer transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default NotAuthorized

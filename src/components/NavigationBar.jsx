import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { toast } from 'react-toastify';

const NavigationBar = () => {
  const { user } = useContext(DataContext);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('laundry_customer_id'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function handleLogout(){
    localStorage.removeItem("laundry_customer_id")
    localStorage.removeItem("CustomerToken")
    toast.success("logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setIsLoggedIn(false);
    navigate("/")
  }

  function accessOrder(){
    const currentLogin = localStorage.getItem('laundry_customer_id');
    if(!currentLogin){
      navigate("/auth")
      toast.info("Please login to access this feature", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      navigate("/order")
    }
  }


  return (
    <nav className="bg-[#000980] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <HiOutlineShoppingBag className="h-7 w-7 text-[#0BA5C6]" />
              <span 
                className="ml-2 text-2xl font-bold" 
                style={{ fontFamily: "'Bauhaus 93', sans-serif", color: '#0BA5C6' }}
              >
                Laundry Pro
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-lg font-medium hover:underline transition-colors"
              style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-md text-md font-medium hover:bg-[#2D0BC6] transition-colors"
              style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            >
              About
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 rounded-md text-md font-medium hover:bg-[#2D0BC6] transition-colors"
              style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            >
              Services
            </Link>
            <p
              onClick={accessOrder}
              className="px-3 py-2 cursor-pointer rounded-md text-md font-medium hover:bg-[#2D0BC6] transition-colors"
              style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            >
              Order
            </p>
            <Link
              to="/contact"
              className="px-3 py-2 rounded-md text-md font-medium hover:bg-[#2D0BC6] transition-colors"
              style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-[#2D0BC6] transition-colors"
                >
                  <FiUser className="h-5 w-5" />
                  <span 
                    className="ml-1 text-md font-medium"
                    style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                  >
                    Profile
                  </span>
                </Link>
                <div
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span 
                    className="ml-1 text-md font-medium"
                    style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                  >
                    Logout
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-md font-medium text-white bg-[#0BA5C6] rounded-md hover:bg-[#0A6FC2] transition-colors"
                  style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="mr-4 p-2 rounded-full hover:bg-[#2D0BC6]"
              >
                <FiUser className="h-6 w-6" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="mr-4 px-3 py-2 text-md font-medium rounded-md hover:bg-[#2D0BC6]"
                style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
              >
                Sign In
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#2D0BC6] focus:outline-none"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#2D0BC6]`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/prices"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            onClick={toggleMenu}
          >
            Prices
          </Link>
          <Link
            to="/services"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            to="/order"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            onClick={toggleMenu}
          >
            Order
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
            onClick={toggleMenu}
          >
            Contact
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#000980]"
                style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <Link
                className="block px-3 py-2 rounded-md text-base font-medium  hover:bg-blue-600"
                style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                onClick={handleLogout}
              >
                Logout
              </Link>
            </>
          )}
          {!isLoggedIn && (
            <div className="pt-4 pb-2 border-t border-[#000980]">
              <Link
                to="/auth"
                className="block w-full px-4 py-2 text-center text-base font-medium hover:bg-[#000980] rounded-md"
                style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                onClick={toggleMenu}
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="block w-full mt-2 px-4 py-2 text-center text-base font-medium text-white bg-[#0BA5C6] hover:bg-[#0A6FC2] rounded-md"
                style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "axios";
import { DataContext } from "../../context/DataContext";

const UserAuth = () => {
  const { user, setUser, getUser } = useContext(DataContext);
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const branchOptions = [];

  const [signUpData, setSignUpData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    branch: "",
    role: "customer",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressChange = (selectedOption) => {
    setSignUpData((prev) => ({
      ...prev,
      branch: selectedOption.value,
    }));
  };

  const isLoggedIn = localStorage.getItem("laundry_user_id");

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5002/laundry/api/branch/all"
      );
      const branchOptions = response.data.data.map((branch) => ({
        value: branch._id,
        label: `${branch.branch_name}, ${branch.city}, ${branch.state}, ${branch.address}`,
      }));
      setBranches(branchOptions);
    } catch (error) {
      toast.error("Failed to fetch branches");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !signUpData.first_name ||
      !signUpData.last_name ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.confirmPassword ||
      !signUpData.branch
    ) {
      toast.error("Please fill in all fields including branch selection", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error("Password is too short", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (signUpData.password != signUpData.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:5002/laundry/api/users/register",
        signUpData,
        {
          withCredentials: true,
        }
      );
      if (resp.data.success) {
        toast.success("User registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/verify-email')
      } else {
        toast.error(resp.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setSignUpData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        branch: "",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:5002/laundry/api/users/login",
        signInData
      );
      console.log(resp);
      console.log(resp.data.token);
      const token = resp.data.token;
      localStorage.setItem("token", token)
      if (resp.data.success) {
        if (resp.data.data.role === "admin") {
          localStorage.setItem("laundry_user_id", resp.data.data.id);
          setUser(resp.data.data);
          navigate("/admin-dashboard/overview");
          toast.success("Admin logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn;
        }
        if (resp.data.data.role === "customer") {
          localStorage.setItem("laundry_user_id", resp.data.data.id);
          setUser(resp.data.data);
          navigate("/");
          toast.success("User Logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn;
        }
        if (resp.data.data.role === "supplier") {
          localStorage.setItem("laundry_user_id", resp.data.data.id);
          setUser(resp.data.data);
          navigate("/supplier-dashboard/overview");
          toast.success("User Logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn;
        }
        if (resp.data.data.role === "manager") {
          localStorage.setItem("laundry_user_id", resp.data.data.id);
          setUser(resp.data.data);
          navigate("/manager-dashboard/overview");
          toast.success("User Logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn;
        }
        if (resp.data.data.role === "employee") {
          localStorage.setItem("laundry_user_id", resp.data.data.id);
          setUser(resp.data.data);
          navigate("/employee-dashboard/overview");
          toast.success("Employee Logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn;
        }
      } else {
        console.log(resp.data);
        toast.error(
          resp?.data?.message || "An error occured while logging in",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      setSignInData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An error occured while logging in",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      isLoggedIn;
      getUser();
      setLoading(false);
    }
  };

  const showSignUp = () => {
    setError(null);
    setRightPanelActive(true);
  };

  const showSignIn = () => {
    setError(null);
    setRightPanelActive(false);
  };

  return (
    <div
      className={`min-h-screen relative flex justify-center transition-colors duration-700 ${
        rightPanelActive ? "bg-gray-100" : "bg-gray-900"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden h-full">
        {[...Array(105)].map((_, i) => {
          const size = Math.random() * 60 + 30;
          const delay = Math.random() * 5;
          const duration = Math.random() * 15 + 10;
          const left = Math.random() * 100;
          const bottom = -size;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `${bottom}px`,
                animation: `bubbleUp ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 2px 1px rgba(255,255,255,0.3)`,
                filter: "blur(0.5px)",
              }}
            />
          );
        })}
      </div>
      <div className="relative w-full mt-10 max-w-4xl h- my-15 bg-white rounded-4xl shadow-2xl flex oveflow-hidden">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 w-3/4 text-center">
            {error}
          </div>
        )}

        <div className="w-1/2 h-full">
          <form
            className="h-full flex flex-col rounded-4xl items-center justify-center px-8 py-8 bg-white"
          >
            <div className="flex space-x-4 my-">
              <button
                type="button"
                disabled={loading}
                className="w-50 relative cursor-pointer bg--500 h-[48px] rounded-full flex items-center pr-3 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out disabled:opacity-50"
              >
                <div className="w-11 h-11 items-center z-10 py-3 border-2 bg-grey-400 rounded-full flex justify-center">
                  <FaGoogle />
                </div>
                <p className="text-sm py-1 z-0 border-2 border-gray-800 hover:text-blue-500 w-[150px] absolute left-9 text-gray-400 border-l-0 font-semibold rounded-r-full">
                  {loading ? "Processing..." : "Sign up with google"}
                </p>
              </button>
            </div>
            <span className="text-xs text-gray-500 my-2">
              or use your email for registration
            </span>

            <div className="w-full grid grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={signUpData.first_name}
                onChange={handleSignUpChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-100 border-none rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={signUpData.last_name}
                onChange={handleSignUpChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-100 border-none rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-100 border-none rounded-2xl shadow-md mt-3 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={signUpData.phone}
              onChange={handleSignUpChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-100 border-none rounded-2xl shadow-md mt-3 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
            />

            <div className="w-full mt-3">
              <Select
                options={branches}
                onChange={handleAddressChange}
                value={branchOptions.find(
                  (option) => option.value === signUpData.branch
                )}
                placeholder="Select your nearest branch"
                required
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    backgroundColor: "#f3f4f6",
                    border: "none",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.2)",
                    },
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#e5e7eb" : "white",
                    color: "#111827",
                  }),
                }}
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={signUpData.password}
              onChange={handleSignUpChange}
              required
              minLength={6}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-100 border-none rounded-2xl shadow-md mt-3 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={signUpData.confirmPassword}
              onChange={handleSignUpChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-100 border-none rounded-2xl shadow-md mt-3 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              onClick={handleSignUp}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-2xl font-bold uppercase text-xs tracking-wider mt-4 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                loading ? "bg-gray-500 text-white" : "bg-gray-800 text-white"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="w-1/2 h-full">
          <form className="h-full rounded-4xl flex flex-col items-center justify-center px-12 py-8 bg-white">
            <h1 className="text-2xl font-bold mb-5">Sign In</h1>
            <div className="flex space-x-4 my-4">
              <button
                type="button"
                disabled={loading}
                className="w-50 relative cursor-pointer bg--500 h-[48px] rounded-full flex items-center pr-3 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out disabled:opacity-50"
              >
                <div className="w-11 h-11 items-center z-10 py-3 border-2 bg-grey-400 rounded-full flex justify-center">
                  <FaGoogle />
                </div>
                <p className="text-sm py-1 z-0 border-2 border-gray-800 hover:text-blue-500 w-[150px] absolute left-9 text-gray-400 border-l-0 font-semibold rounded-r-full">
                  {loading ? "Processing..." : "Login with google"}
                </p>
              </button>
            </div>
            <span className="text-xs text-gray-500 my-2">
              or use your account
            </span>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signInData.email}
              onChange={handleSignInChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signInData.password}
              onChange={handleSignInChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-2xl shadow-md mt-3 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:scale-105 transition-all disabled:opacity-50"
            />

            <div className="w-full flex justify-between items-center text-xs mt-2">
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleLogin}
              className={`w-full py-3 px-6 rounded-2xl font-bold uppercase text-xs tracking-wider mt-4 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                loading ? "bg-blue-300 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div
          className={`absolute rounded-3xl top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-1500 ease-in-out z-30 ${
            rightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`relative h-full w-[200%] left-[-100%] bg-gradient-to-r from-blue-200 to-blue-950 transition-all duration-700 ease-in-out ${
              rightPanelActive ? "translate-x-[50%]" : ""
            }`}
          >
            <div
              className={`absolute top-0 flex flex-col items-center justify-center px-12 py-8 h-full w-1/2 transition-all duration-700 ease-in-out ${
                rightPanelActive ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <h1 className="text-2xl font-bold mb-5 text-gray-800">
                Welcome Back!
              </h1>
              <p className="text-sm text-center text-gray-700 mb-6">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={showSignIn}
                disabled={loading}
                className="py-3 px-6 bg-transparent border-2 border-gray-800 text-gray-800 rounded-2xl font-bold uppercase text-xs tracking-wider hover:bg-gray-800 hover:text-white transition-colors active:scale-95 disabled:opacity-50"
              >
                Sign In?
              </button>
            </div>

            <div
              className={`absolute top-0 right-0 flex flex-col items-center justify-center px-12 py-8 h-full w-1/2 transition-all duration-700 ease-in-out ${
                rightPanelActive ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <h1 className="text-2xl font-bold mb-5 text-white">
                Hello, Friend!
              </h1>
              <p className="text-sm text-center text-white mb-6">
                Enter your personal details and start your journey with us
              </p>
              <button
                onClick={showSignUp}
                disabled={loading}
                className="py-3 px-6 bg-transparent border-2 border-white text-white rounded-2xl font-bold uppercase text-xs tracking-wider hover:bg-gray-800 hover:border-gray-800 transition-colors active:scale-95 disabled:opacity-50"
              >
                Sign Up?
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes bubbleUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          20% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default UserAuth;

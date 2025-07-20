import React, { useContext, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import {
  FaTshirt,
  FaSocks,
  FaBed,
  FaShoppingBag,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaChevronRight,
  FaChevronLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaPaypal,
} from "react-icons/fa";
import { TbTie, TbIroningSteam, TbTruckDelivery } from "react-icons/tb";
import { GiClothes } from "react-icons/gi";
import BackToTop from "../../components/BackToTop";
import { DataContext } from "../../context/DataContext";
import { toast } from "react-toastify";
import axios from "axios";
import StripePaymentForm from "../../components/StripePaymentForm";

const Order = () => {
  const stripePromise = loadStripe(
    "pk_test_51RltiPDGBYwV6nw0hSgQVVvN4vfeF69AL6LblPpfqGNo8Um3AGeOXTKnA1ayWJrBtf8iPAAX6dA9tjASsaEYZhUt00jvwlloka"
  );
  const { user } = useContext(DataContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("washFold");
  const [services, setServices] = useState([
    {
      id: 1,
      name: "T-Shirt",
      price: 1000,
      category: "washFold",
      selected: false,
      quantity: 0,
      icon: <FaTshirt />,
    },
    {
      id: 2,
      name: "Dress Shirt",
      price: 1200,
      category: "washFold",
      selected: false,
      quantity: 0,
      icon: <TbTie />,
    },
    {
      id: 3,
      name: "Pants",
      price: 1500,
      category: "washFold",
      selected: false,
      quantity: 0,
      icon: <GiClothes />,
    },
    {
      id: 4,
      name: "Socks (pair)",
      price: 500,
      category: "washFold",
      selected: false,
      quantity: 0,
      icon: <FaSocks />,
    },
    {
      id: 5,
      name: "Bed Sheet",
      price: 2500,
      category: "washFold",
      selected: false,
      quantity: 0,
      icon: <FaBed />,
    },
    {
      id: 6,
      name: "Suits",
      price: 6000,
      category: "dryClean",
      selected: false,
      quantity: 0,
      icon: <TbTie />,
    },
    {
      id: 7,
      name: "Dresses",
      price: 5000,
      category: "dryClean",
      selected: false,
      quantity: 0,
      icon: <GiClothes />,
    },
    {
      id: 8,
      name: "Wool Sweaters",
      price: 4000,
      category: "dryClean",
      selected: false,
      quantity: 0,
      icon: <FaTshirt />,
    },
    {
      id: 9,
      name: "Premium Pressing (Shirt)",
      price: 1500,
      category: "pressing",
      selected: false,
      quantity: 0,
      icon: <TbIroningSteam />,
    },
    {
      id: 10,
      name: "Premium Pressing (Pants)",
      price: 2000,
      category: "pressing",
      selected: false,
      quantity: 0,
      icon: <TbIroningSteam />,
    },
  ]);

  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");

  const calculateTotal = () => {
    return services.reduce((total, service) => {
      return total + (service.selected ? service.price * service.quantity : 0);
    }, 0);
  };

  const toggleService = (id) => {
    setServices(
      services.map((service) =>
        service.id === id
          ? {
              ...service,
              selected: !service.selected,
              quantity: service.selected ? 0 : 1,
            }
          : service
      )
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 0) return;
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, quantity } : service
      )
    );
  };

  const filteredServices = services.filter((service) =>
    orderType === "washFold"
      ? service.category === "washFold"
      : orderType === "dryClean"
      ? service.category === "dryClean"
      : service.category === "pressing"
  );

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      branch_id: user.branch,
      user_id: user.id,
      items: services
        .filter((s) => s.selected)
        .map((item) => ({
          service_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
      total_price: calculateTotal(),
      payment_type: paymentMethod,
      is_paid: paymentMethod !== "cash",
      delivery_option: deliveryOption,
      pickup_date: deliveryOption === "pickup" ? pickupDate : undefined,
      pickup_time: deliveryOption === "pickup" ? pickupTime : undefined,
      delivery_date: deliveryOption === "pickup" ? deliveryDate : undefined,
      delivery_time: deliveryOption === "pickup" ? deliveryTime : undefined,
      address: deliveryOption === "pickup" ? address : undefined,
      special_requests: specialRequests,
      order_notes: orderNotes,
      status: "not_started",
      assigned_employee_id: null,
    };

    try {
      const response = await axios.post(
        "http://localhost:5002/laundry/api/order/create",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Order created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setServices(
          services.map((s) => ({ ...s, selected: false, quantity: 0 }))
        );
        setDeliveryOption("pickup");
        setPickupDate("");
        setPickupTime("");
        setDeliveryDate("");
        setDeliveryTime("");
        setAddress("");
        setSpecialRequests("");
        setPaymentMethod("card");
        setOrderNotes("");
        navigate("/profile");
      } else {
        toast.error(
          response.data.message || "An error occurred while creating the order",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the order",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = () => {
    switch (orderType) {
      case "washFold":
        return <FaTshirt className="text-2xl" />;
      case "dryClean":
        return <TbTie className="text-2xl" />;
      case "pressing":
        return <TbIroningSteam className="text-2xl" />;
      default:
        return <FaShoppingBag className="text-2xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4">
      <BackToTop />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white p-8">
          <h1 className="text-3xl font-bold flex items-center">
            {getCategoryIcon()}
            <span className="ml-4">
              {orderType === "washFold"
                ? "Wash & Fold"
                : orderType === "dryClean"
                ? "Dry Cleaning"
                : "Pressing"}{" "}
              Service
            </span>
          </h1>

          <div className="flex justify-between mt-8 px-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className="flex flex-col items-center relative"
              >
                {stepNumber > 1 && (
                  <div
                    className={`absolute h-1 w-16 -left-16 top-5 
                    ${step >= stepNumber ? "bg-blue-400" : "bg-indigo-700"}`}
                  ></div>
                )}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                  ${
                    step >= stepNumber
                      ? "bg-blue-400 text-white shadow-lg"
                      : "bg-indigo-700 text-blue-200"
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step >= stepNumber ? "text-white" : "text-blue-200"
                  }`}
                >
                  {stepNumber === 1
                    ? "Select Items"
                    : stepNumber === 2
                    ? "Delivery Info"
                    : "Payment"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setOrderType("washFold")}
                  className={`px-6 py-3 rounded-xl flex items-center transition-all shadow-sm
                    ${
                      orderType === "washFold"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-white text-indigo-800 border border-indigo-200 hover:border-indigo-400"
                    }`}
                >
                  <FaTshirt className="mr-3" />
                  Wash & Fold
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("dryClean")}
                  className={`px-6 py-3 rounded-xl flex items-center transition-all shadow-sm
                    ${
                      orderType === "dryClean"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-white text-indigo-800 border border-indigo-200 hover:border-indigo-400"
                    }`}
                >
                  <TbTie className="mr-3" />
                  Dry Cleaning
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("pressing")}
                  className={`px-6 py-3 rounded-xl flex items-center transition-all shadow-sm
                    ${
                      orderType === "pressing"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-white text-indigo-800 border border-indigo-200 hover:border-indigo-400"
                    }`}
                >
                  <TbIroningSteam className="mr-3" />
                  Pressing
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <div
                    onClick={() => toggleService(service.id)}
                    key={service.id}
                    className={`flex items-center justify-between p-5 rounded-xl transition-all border
                    ${
                      service.selected
                        ? "border-blue-400 bg-blue-50 shadow-inner"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-indigo-900">
                          {service.name}
                        </h3>
                        <p className="text-sm text-indigo-600">
                          ₦
                          {service.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          per item
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(service.id, service.quantity - 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                        disabled={service.quantity <= 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {service.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(service.id, service.quantity + 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-6">
                <div className="text-xl font-bold text-indigo-900">
                  Estimated Total:{" "}
                  <span className="text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-8 py-4 text-white rounded-xl font-bold flex items-center transition-all shadow-lg
                    ${
                      calculateTotal() > 0
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  disabled={calculateTotal() <= 0}
                >
                  Continue to Delivery
                  <FaChevronRight className="ml-3" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-indigo-900">
                  Delivery Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("pickup")}
                    className={`p-5 rounded-xl flex items-center transition-all border-2
                      ${
                        deliveryOption === "pickup"
                          ? "border-blue-500 bg-blue-50 shadow-inner"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                  >
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
                      <TbTruckDelivery className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">
                        Pickup & Delivery
                      </h4>
                      <p className="text-sm text-indigo-600">
                        We'll come to you
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption("dropoff")}
                    className={`p-5 rounded-xl flex items-center transition-all border-2
                      ${
                        deliveryOption === "dropoff"
                          ? "border-blue-500 bg-blue-50 shadow-inner"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                  >
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
                      <FaShoppingBag className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">
                        Drop Off
                      </h4>
                      <p className="text-sm text-indigo-600">
                        Bring to our location
                      </p>
                    </div>
                  </button>
                </div>

                {deliveryOption === "pickup" && (
                  <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-indigo-900 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-600" />
                      Pickup & Delivery Details
                    </h4>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-indigo-800">
                          Pickup Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                          <FaCalendarAlt className="absolute right-3 top-3.5 text-indigo-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-indigo-800">
                          Pickup Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                          />
                          <FaClock className="absolute right-3 top-3.5 text-indigo-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-indigo-800">
                          Delivery Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            min={
                              pickupDate ||
                              new Date().toISOString().split("T")[0]
                            }
                            required
                          />
                          <FaCalendarAlt className="absolute right-3 top-3.5 text-indigo-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-indigo-800">
                          Delivery Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                          />
                          <FaClock className="absolute right-3 top-3.5 text-indigo-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-indigo-800">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Enter your full address"
                        required
                      />
                    </div>
                  </div>
                )}

                {deliveryOption === "dropoff" && (
                  <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-indigo-900 mb-1">
                          Drop Off Location
                        </h4>
                        <p className="text-indigo-700">
                          Please bring your items to our main facility at{" "}
                          <span className="font-semibold">
                            123 Laundry Lane, Clean City
                          </span>{" "}
                          during business hours (8AM-6PM).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-800">
                    Special Requests
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    rows="4"
                    placeholder="Any special care instructions for your items..."
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-10 gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-xl font-bold flex items-center shadow-sm"
                >
                  <FaChevronLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold flex items-center shadow-lg"
                >
                  Continue to Payment
                  <FaChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-indigo-900">
                  Payment Method
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div
                    className={`p-5 rounded-xl cursor-pointer transition-all border-2
                      ${
                        paymentMethod === "card"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
                        <FaCreditCard className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-900">
                          Credit Card
                        </h4>
                        <p className="text-sm text-indigo-600">
                          Visa, Mastercard, etc.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-5 rounded-xl cursor-pointer transition-all border-2
                      ${
                        paymentMethod === "paypal"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
                        <FaPaypal className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-900">
                          PayPal
                        </h4>
                        <p className="text-sm text-indigo-600">
                          Secure online payment
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-5 rounded-xl cursor-pointer transition-all border-2
                      ${
                        paymentMethod === "cash"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 mr-4">
                        <FaMoneyBillWave className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-900">Cash</h4>
                        <p className="text-sm text-indigo-600">
                          Pay when delivered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm
                        total={calculateTotal()}
                        orderData={{
                          branch_id: user.branch,
                          user_id: user.id,
                          items: services
                            .filter((s) => s.selected)
                            .map((item) => ({
                              service_id: item.id,
                              quantity: item.quantity,
                              price: item.price,
                              name: item.name,
                            })),
                          total_price: calculateTotal(),
                          payment_type: "card",
                          is_paid: true,
                          delivery_option: deliveryOption,
                          pickup_date:
                            deliveryOption === "pickup"
                              ? pickupDate
                              : undefined,
                          pickup_time:
                            deliveryOption === "pickup"
                              ? pickupTime
                              : undefined,
                          delivery_date:
                            deliveryOption === "pickup"
                              ? deliveryDate
                              : undefined,
                          delivery_time:
                            deliveryOption === "pickup"
                              ? deliveryTime
                              : undefined,
                          address:
                            deliveryOption === "pickup" ? address : undefined,
                          special_requests: specialRequests,
                          order_notes: orderNotes,
                          status: "not_started",
                          assigned_employee_id: null,
                        }}
                        onSuccess={() => {
                          toast.success(
                            "Payment and order completed successfully!"
                          );
                          setServices(
                            services.map((s) => ({
                              ...s,
                              selected: false,
                              quantity: 0,
                            }))
                          );
                          setDeliveryOption("pickup");
                          setPickupDate("");
                          setPickupTime("");
                          setDeliveryDate("");
                          setDeliveryTime("");
                          setAddress("");
                          setSpecialRequests("");
                          setPaymentMethod("card");
                          setOrderNotes("");
                          navigate("/profile");
                        }}
                        onError={(error) => {
                          toast.error(error || "Payment failed");
                        }}
                      />
                    </Elements>
                  </div>
                )}

                {paymentMethod !== "card" && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-indigo-800">
                        Order Notes
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        rows="4"
                        placeholder="Any additional notes for your order..."
                      />
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                      <h4 className="font-bold text-xl mb-4 text-indigo-900">
                        Order Summary
                      </h4>
                      <div className="space-y-3 mb-4">
                        {services
                          .filter((s) => s.selected)
                          .map((service) => (
                            <div
                              key={service.id}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mr-3">
                                  {service.icon}
                                </div>
                                <span className="text-indigo-800">
                                  {service.name} ×{service.quantity}
                                </span>
                              </div>
                              <span className="font-medium">
                                ${(service.price * service.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                      </div>
                      <div className="border-t border-indigo-300 pt-4 font-bold flex justify-between text-xl">
                        <span className="text-indigo-900">Total Amount</span>
                        <span className="text-blue-600">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-10 gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-xl font-bold flex items-center shadow-sm"
                      >
                        <FaChevronLeft className="mr-2" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold flex items-center shadow-xl text-lg"
                      >
                        Confirm & Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Order;

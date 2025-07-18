import React from 'react';
import { Link } from 'react-router-dom';
import { FaTshirt, FaSocks, FaBed, FaShippingFast } from 'react-icons/fa';
import { TbTie } from "react-icons/tb";
import BackToTop from '../../components/BackToTop';

const Prices = () => {
  const pricingPlans = [
    {
      name: "Basic Wash & Fold",
      price: "$1.50",
      perItem: "per pound",
      description: "Perfect for everyday laundry needs",
      features: [
        "Washed with premium detergents",
        "Gentle machine drying",
        "Neatly folded",
        "24-hour turnaround"
      ],
      icon: <FaTshirt className="text-4xl mb-4 text-[#0BA5C6]" />,
      popular: false
    },
    {
      name: "Premium Care",
      price: "$3.00",
      perItem: "per pound",
      description: "For clothes needing extra attention",
      features: [
        "All Basic Wash & Fold features",
        "Separated by color/fabric",
        "Low-heat drying",
        "Hand folding",
        "12-hour turnaround"
      ],
      icon: <TbTie className="text-4xl mb-4 text-[#0BA5C6]" />,
      popular: true
    },
    {
      name: "Dry Cleaning",
      price: "$8.99",
      perItem: "per item",
      description: "Professional care for delicate fabrics",
      features: [
        "Expert stain treatment",
        "Specialized cleaning",
        "Professional pressing",
        "Garment bag included",
        "48-hour turnaround"
      ],
      icon: <FaBed className="text-4xl mb-4 text-[#0BA5C6]" />,
      popular: false
    }
  ];

  const aLaCarteItems = [
    { name: "Dress Shirt", price: "$2.99", icon: <TbTie /> },
    { name: "T-Shirt", price: "$1.99", icon: <FaTshirt /> },
    { name: "Pair of Socks", price: "$0.99", icon: <FaSocks /> },
    { name: "Bed Sheet", price: "$4.99", icon: <FaBed /> },
    { name: "Express Service", price: "+$5.00", icon: <FaShippingFast /> }
  ];

  return (
    <div className="min-h-screen bg-[#D6D6D6]">
      <BackToTop/>
      <section className="relative bg-[#000980] text-white py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Bauhaus 93', sans-serif" }}>
            Simple, <span className="text-[#0BA5C6]">Transparent</span> Pricing
          </h1>
          <p className="text-xl mb-8 text-[#0BA5C6]">
            Quality service at fair prices with no hidden fees
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#000980] mb-4">
            Service Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the option that best fits your laundry needs
          </p>
          <div className="w-24 h-1 bg-[#0BA5C6] mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl shadow-lg overflow-hidden ${plan.popular ? 'border-2 border-[#0BA5C6]' : 'border border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#0BA5C6] text-white px-4 py-1 text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className="bg-white p-8 h-full">
                <div className="text-center">
                  {plan.icon}
                  <h3 className="text-2xl font-bold text-[#000980] mb-2">{plan.name}</h3>
                  <div className="flex justify-center items-baseline mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.perItem}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-[#0BA5C6] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/order" 
                  className={`block w-full text-center px-6 py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#0BA5C6] hover:bg-[#098fb4] text-white' : 'bg-[#000980] hover:bg-[#2D0BC6] text-white'}`}
                >
                  Choose Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-[#0BA5C6] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Individual Item Pricing
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Pay only for what you need with our per-item services
            </p>
            <div className="w-24 h-1 bg-white mx-auto mt-4"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {aLaCarteItems.map((item, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                <p className="text-2xl font-bold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#D6D6D6] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#000980]">
            Have Special Requests?
          </h2>
          <p className="text-xl text-[#000980] mb-8">
            Contact us for bulk discounts, commercial rates, or special garment care
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-[#000980] hover:bg-[#2D0BC6] rounded-lg text-white font-bold transition-all"
            >
              Get a Custom Quote
            </Link>
            <Link 
              to="/faq" 
              className="px-8 py-3 bg-white text-[#000980] hover:bg-gray-200 rounded-lg font-bold transition-all"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prices;
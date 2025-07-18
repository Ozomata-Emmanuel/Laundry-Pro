import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTshirt,
  FaSocks,
  FaBed,
  FaShippingFast,
  FaLeaf,
  FaShieldAlt,
  FaRegClock,
  FaRegSmile
} from 'react-icons/fa';
// import { GiIron, GiWaterDrop } from 'react-icons/gi';
import { TbTie } from "react-icons/tb";
import { MdOutlineWaterDrop } from "react-icons/md";
import BackToTop from '../../components/BackToTop';


const Services = () => {
  const mainServices = [
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

  const specialtyServices = [
    {
      title: "Eco Cleaning",
      icon: <FaLeaf className="text-3xl text-[#0BA5C6]" />,
      description: "Environmentally friendly cleaning with plant-based solutions"
    },
    {
      title: "Stain Treatment",
      icon: <MdOutlineWaterDrop className="text-3xl text-[#0BA5C6]" />,
      description: "Advanced techniques for stubborn stains"
    },
    {
      title: "Commercial Laundry",
      icon: <FaBed className="text-3xl text-[#0BA5C6]" />,
      description: "Bulk services for businesses and organizations"
    },
    {
      title: "Express Service",
      icon: <FaRegClock className="text-3xl text-[#0BA5C6]" />,
      description: "Get your laundry back in as little as 4 hours"
    },
    {
      title: "Fabric Protection",
      icon: <FaShieldAlt className="text-3xl text-[#0BA5C6]" />,
      description: "Special treatments to extend garment life"
    },
    {
      title: "Special Care",
      icon: <FaRegSmile className="text-3xl text-[#0BA5C6]" />,
      description: "Hand washing for delicate items"
    }
  ];

  return (
    <div className="min-h-screen bg-[#D6D6D6]">
      <BackToTop/>
      <section className="relative bg-gradient-to-b from-[#000980] to-[#0A6FC2] text-white h-[80vh] flex items-center px-4 text-center">
        <img src="icnon_beaver_nil_bg.png" className="absolute h-[80vh] left-0 hidden lg:block" alt="" />
        <div className="max-w-4xl mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#0ba5c6]" style={{ fontFamily: "'Bauhaus 93', sans-serif" }}>
            Our <span className="text-white">Services</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white">
            Comprehensive fabric care solutions tailored to your needs
          </p>
        </div>
                <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 60 + 30;
            const delay = Math.random() * 5;
            const duration = Math.random() * 12 + 7;
            const left = Math.random() * 100;
            const bottom = -size;
            
            return (
              <div 
                key={i}
                className="absolute rounded-full bg-white opacity-20"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  bottom: `${bottom}px`,
                  animation: `bubbleUp ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 2px 1px rgba(255,255,255,0.3)`,
                  filter: 'blur(0.5px)'
                }}
              />
            );
          })}
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
              transform: translateY(-88vh) scale(0.8);
              opacity: 0;
            }
          }
        `}</style>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#000980] mb-4">
            Core Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional care for all your laundry needs
          </p>
          <div className="w-24 h-1 bg-[#0BA5C6] mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mainServices.map((plan, index) => (
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
              Specialty Services
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Additional options for specific fabric care needs
            </p>
            <div className="w-24 h-1 bg-white mx-auto mt-4"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {specialtyServices.map((service, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="flex items-start">
                  <div className="mr-4">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="opacity-90">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 px-4 bg-[#D6D6D6] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#000980]">
            Ready to Experience Professional Laundry Care?
          </h2>
          <p className="text-xl text-[#000980] mb-8">
            Schedule a pickup today and let us handle the laundry
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/order" 
              className="px-8 py-3 bg-[#000980] hover:bg-[#2D0BC6] rounded-lg text-white font-bold transition-all"
            >
              Order Now
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white text-[#000980] hover:bg-gray-200 rounded-lg font-bold transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
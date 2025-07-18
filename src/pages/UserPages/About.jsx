import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaShower, 
  FaLeaf, 
  FaUserTie, 
  FaHeadset,
  FaRegClock,
  FaMedal,
  FaTshirt,
  FaWater
} from 'react-icons/fa';
import { GoArrowRight } from "react-icons/go";
import { BsRecycle } from 'react-icons/bs';
import BackToTop from '../../components/BackToTop';
const About = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Advanced Cleaning Technology",
      bg: "bg-gradient-to-tr from-[#00d0ff] to-[#0099bb]",
      content: (
        <>
          <p className="mb-4">
            Our state-of-the-art cleaning facilities utilize industrial-grade washers and dryers that combine powerful cleaning action with fabric-preserving technology. We've partnered with leading detergent manufacturers to develop proprietary cleaning solutions that remove 97.3% of common stains while being gentle on even delicate fabrics.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span>Temperature-controlled washing preserves fabric integrity</span>
            </li>
            <li className="flex items-start">
              <span>Advanced water filtration removes 99.8% of detergent residues</span>
            </li>
            <li className="flex items-start">
              <span>Professional-grade steam finishing eliminates wrinkles</span>
            </li>
          </ul>
          <p>
            Each load is monitored by trained technicians to ensure optimal cleaning results while maintaining the longevity of your garments.
          </p>
        </>
      )
    },
    {
      title: "Precision Garment Care",
      bg: "bg-gradient-to-tr from-[#00a5ca] to-[#005eca]",
      content: (
        <>
          <p className="mb-4">
            Our garment care specialists undergo a rigorous 120-hour training program in professional folding and finishing techniques. Each article of clothing is handled according to its specific fabric type and care requirements.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="font-bold text-[#000980] mb-2">Folding Standards:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FaMedal className="text-[#0A6FC2] mr-2 mt-1 flex-shrink-0" />
                  <span>Shirts folded to 13" width with reinforced collars</span>
                </li>
                <li className="flex items-start">
                  <FaMedal className="text-[#0A6FC2] mr-2 mt-1 flex-shrink-0" />
                  <span>Pants aligned with precise creases</span>
                </li>
                <li className="flex items-start">
                  <FaMedal className="text-[#0A6FC2] mr-2 mt-1 flex-shrink-0" />
                  <span>Delicates hand-folded with tissue interleaving</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#000980] mb-2">Quality Control:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span>Three-stage inspection process</span>
                </li>
                <li className="flex items-start">
                  <span>48-hour quality guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Sustainable Operations",
      bg: "bg-gradient-to-tr from-[#157be0] to-[#000a9c]",
      content: (
        <>
          <p className="mb-4">
            We're committed to environmental stewardship without compromising cleaning quality. Our facilities have achieved Green Business Certification through implementing innovative sustainability measures:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="font-bold text-[#000980] mb-2">Energy & Water:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BsRecycle className="text-[#000980] mr-2 mt-1 flex-shrink-0" />
                  <span>80% renewable energy usage</span>
                </li>
                <li className="flex items-start">
                  <BsRecycle className="text-[#000980] mr-2 mt-1 flex-shrink-0" />
                  <span>Closed-loop water recycling system</span>
                </li>
                <li className="flex items-start">
                  <BsRecycle className="text-[#000980] mr-2 mt-1 flex-shrink-0" />
                  <span>Energy-efficient LED lighting throughout</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#000980] mb-2">Materials:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <BsRecycle className="text-[#000980] mr-2 mt-1 flex-shrink-0" />
                  <span>100% biodegradable packaging</span>
                </li>
                <li className="flex items-start">
                  <BsRecycle className="text-[#000980] mr-2 mt-1 flex-shrink-0" />
                  <span>Plant-based cleaning solutions</span>
                </li>
                <li className="flex items-start">
                  <BsRecycle className="text-[#000980] mr-2 mt-1 flex-shrink-0" />
                  <span>Carbon-neutral delivery fleet</span>
                </li>
              </ul>
            </div>
          </div>
          <p>
            These initiatives reduce our environmental impact while delivering exceptional cleaning results - proving sustainability and performance can coexist.
          </p>
        </>
      )
    },
    {
      title: "Customer-Centric Service",
      bg: "bg-gradient-to-tr from-[#0241bd] to-[#0f014d]",
      content: (
        <>
          <p className="mb-4 ">
            Our service model is designed around convenience, transparency, and exceptional support. We've reimagined every touchpoint to create a seamless laundry experience:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="font-bold text-[#000980] mb-2">Convenience Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FaRegClock className="text-[#2D0BC6] mr-2 mt-1 flex-shrink-0" />
                  <span>24/7 online scheduling and tracking</span>
                </li>
                <li className="flex items-start">
                  <FaRegClock className="text-[#2D0BC6] mr-2 mt-1 flex-shrink-0" />
                  <span>Same-day turnaround available</span>
                </li>
                <li className="flex items-start">
                  <FaRegClock className="text-[#2D0BC6] mr-2 mt-1 flex-shrink-0" />
                  <span>Flexible pickup/delivery windows</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#000980] mb-2">Support:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span>Dedicated account managers</span>
                </li>
                <li className="flex items-start">
                  <span>Real-time SMS/email updates</span>
                </li>
                <li className="flex items-start">
                  <span>No-questions-asked satisfaction guarantee</span>
                </li>
              </ul>
            </div>
          </div>
          <p>
            Our customer service team maintains a 98% satisfaction rating and average response time under 15 minutes - because your time is as valuable as your clothes.
          </p>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#D6D6D6] overflow-hidden">
      <BackToTop/>
      <section className="relative py-32 px-4 text-center bg-gradient-to-b from-[#000980] to-[#0A6FC2]">
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            style={{ fontFamily: "'Bauhaus 93', sans-serif" }}
          >
            <span className="text-[#0BA5C6]">Redefining</span> Laundry Excellence
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Combining cutting-edge technology with an uncompromising commitment to quality since 2012
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link 
              to="/order" 
              className="px-8 py-4 flex items-center justify-center bg-[#0BA5C6] hover:bg-white text-white hover:text-[#000980] rounded-full font-bold text-lg transition-all shadow-xl"
            >
              EXPERIENCE THE DIFFERENCE 
              <GoArrowRight />
            </Link>
          </motion.div>
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
            Why We're Different
          </h2>
          <div className="w-24 h-1 bg-[#0BA5C6] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              onClick={() => setActiveStep(index)}
              className={`cursor-pointer transition-all ${activeStep === index ? 'scale-105 z-10' : 'opacity-90 hover:opacity-100'}`}
            >
              <div className={`${step.bg} p-6 rounded-xl shadow-md h-full flex flex-col items-center text-center text-white`}>
                <span className="text-4xl mb-4">{step.icon}</span>
                <h3 className="text-lg font-bold">{step.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-xl shadow-lg border-t-4 border-[#0BA5C6]"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="text-6xl mb-6 md:mb-0 md:mr-8">{steps[activeStep].icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-[#000980] mb-3">
                {steps[activeStep].title}
              </h3>
              <div className="text-lg text-gray-700">
                {steps[activeStep].content}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-4 bg-[#000980] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our <span className="text-[#0BA5C6]">Results</span> Speak For Themselves
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "10,000+",
                title: "Satisfied Customers",
                description: "Join a growing community that trusts us with their laundry"
              },
              {
                number: "24",
                title: "Hour Turnaround",
                description: "Get your clothes back faster than you can say 'ironing board'"
              },
              {
                number: "99.7%",
                title: "Satisfaction Rate",
                description: "We're not happy until you're thrilled (and we're very particular)"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#0BA5C6]">
                  {stat.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{stat.title}</h3>
                <p className="opacity-90">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
            <section className="py-28 px-4 bg-[#D6D6D6] text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#000980] opacity-5 text-9xl font-bold" style={{ fontFamily: "'Bauhaus 93', sans-serif", transform: 'rotate(-10deg)' }}>
            LAUNDRY LAUNDRY LAUNDRY LAUNDRY
          </div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#000980]">
            Ready to <span className="text-[#0BA5C6]">Upgrade</span> Your Laundry Experience?
          </h2>
          <p className="text-xl text-[#000980] mb-8">
            Stop settling for mediocre results. Your clothes deserve better.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link 
              to="/order" 
              className="px-8 py-4 bg-[#000980] hover:bg-[#2D0BC6] rounded-full text-white font-bold text-lg transition-all shadow-xl"
            >
              LET US HANDLE IT →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
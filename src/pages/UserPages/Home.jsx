import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BackToTop from "../../components/BackToTop";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

const testimonials = [
  {
    id: 1,
    quote:
      "My clothes have never looked better! The folding service is not only precise but makes everything feel like it’s fresh from a boutique. Highly recommend!",
    author: "Sarah J.",
  },
  {
    id: 2,
    quote:
      "The same-day service truly saved me when I was in a pinch before a big meeting. Fast, reliable, and my clothes looked absolutely spotless.",
    author: "Michael T.",
  },
  {
    id: 3,
    quote:
      "The team is incredibly professional, and I’m always impressed by how fresh and clean my clothes come back. They treat every piece with care.",
    author: "Priya K.",
  },
  {
    id: 4,
    quote:
      "I've been using their service for several months now, and the quality has been consistently excellent. It's dependable and makes my week so much easier.",
    author: "David L.",
  },
  {
    id: 5,
    quote:
      "Their attention to detail, especially with delicate and specialty fabrics, is truly impressive. I trust them completely with my wardrobe.",
    author: "Emma R.",
  },
];


  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <BackToTop />
      <section className="relative bg-gradient-to-b from-[#000980] to-[#0A6FC2] text-white h-screen pt-32 px-4 text-center overflow-hidden">
        <img src="icnon_beaver_nil_bg.png" className="absolute h-[80vh] left-20 hidden lg:block" alt="" />
        <div className="">
          <div className="lg:w-60 lg:h-60 w-50 h-50  bg-[#0BA5C6] absolute top-0 right-0 rounded-bl-full"></div>
          <div className="lg:w-55 lg:h-55 w-45 h-45  bg-[#0A6FC2] absolute top-0 right-0 rounded-bl-full"></div>
          <div className="lg:w-50 lg:h-50 w-40 h-40  bg-[#000980] absolute top-0 right-0 rounded-bl-full"></div>
        </div>
        <div className="">
          <div className="lg:w-60 lg:h-60 w-40 h-40  bg-[#0BA5C6] absolute bottom-0 left-0 rounded-tr-full"></div>
          <div className="lg:w-55 lg:h-55 w-35 h-35  bg-[#0A6FC2] absolute bottom-0 left-0 rounded-tr-full"></div>
          <div className="lg:w-50 lg:h-50 w-30 h-30  bg-[#000980] absolute bottom-0 left-0 rounded-tr-full"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(80)].map((_, i) => {
            const size = Math.random() * 80 + 40;
            const delay = Math.random() * 5;
            const duration = Math.random() * 15 + 10;
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
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{
              fontFamily: "'Bauhaus 93', sans-serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              background: "linear-gradient(to right, #fff, #0BA5C6)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Bring your sheets, we'll give you back folded and neat
          </h1>
          <p className="text-lg font-semibold md:text-xl mb-8 text-[#021c66]">
            Professional laundry services with same-day turnaround
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/order"
              className="px-6 py-3 sm:px-8 sm:py-3 bg-[#0BA5C6] hover:bg-[#0A6FC2] rounded-full text-white font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-[#0BA5C6]/50 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
              Order Now
            </Link>
            <Link
              to="/prices"
              className="px-6 py-3 sm:px-8 sm:py-3 bg-white text-[#000980] hover:bg-[#D6D6D6] rounded-full font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-white/50 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              View Prices
            </Link>
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
              transform: translateY(-110vh) scale(0.8);
              opacity: 0;
            }
          }
        `}</style>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#000980] inline-block relative">
            <span className="relative z-10 px-4 border-b-3 border-blue-300">Our Services</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We make laundry day the easiest day of your week with our premium
            services
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-blue-50 hover:border-[#0BA5C6]/30 transition-all"
          >
            <div className="bg-[#0BA5C6]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#0BA5C6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#0A6FC2]">
              Wash & Fold
            </h3>
            <p className="text-gray-700">
              Professional washing and expert folding of your everyday laundry
              items.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-blue-50 hover:border-[#0BA5C6]/30 transition-all"
          >
            <div className="bg-[#0BA5C6]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#0BA5C6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#0A6FC2]">
              Dry Cleaning
            </h3>
            <p className="text-gray-700">
              Specialized care for your delicate garments and formal wear.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-blue-50 hover:border-[#0BA5C6]/30 transition-all"
          >
            <div className="bg-[#0BA5C6]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#0BA5C6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#0A6FC2]">
              Premium Pressing
            </h3>
            <p className="text-gray-700">
              Crisp, professional pressing for shirts, pants, and more.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#0BA5C6] font-semibold">OUR PROCESS</span>
            <h2 className="text-4xl font-bold text-[#000980] mt-2">
              How We Handle Your Laundry
            </h2>
            <div className="w-24 h-1 bg-[#0BA5C6] mx-auto mt-4"></div>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 h-full w-1 bg-[#000980] bg-opacity-20 transform -translate-x-1/2"></div>

            <div className="space-y-8 md:space-y-16">
              {[
                {
                  step: "1",
                  title: "Collection",
                  description:
                    "We pick up your clothes right from your doorstep or preferred drop-off location, making the process effortless and convenient for you. Our friendly team ensures everything is handled with care from the very beginning.",
                },
                {
                  step: "2",
                  title: "Careful Sorting",
                  description:
                    "Each garment is thoughtfully sorted by fabric type, color, and any special customer requests. This careful process helps us provide the exact care your clothes need while preventing color mixing or fabric damage.",
                },
                {
                  step: "3",
                  title: "Wash & Dry",
                  description:
                    "Your clothes are cleaned using professional-grade, eco-friendly products and gentle cycles tailored to each item’s fabric. We ensure every piece is washed and dried with the utmost care to preserve its quality.",
                },
                {
                  step: "4",
                  title: "Premium Pressing",
                  description:
                    "Upon request, we press your garments with precision, leaving them looking crisp, polished, and wrinkle-free. Our advanced equipment and trained team deliver a flawless, fresh-out-of-the-cleaners look.",
                },
                {
                  step: "5",
                  title: "Expert Folding",
                  description:
                    "Each item is carefully folded and packaged to maintain its freshly cleaned appearance. Whether it’s delicate fabrics or everyday wear, we make sure everything is presented with neatness and care.",
                },
                {
                  step: "6",
                  title: "Happy Return",
                  description:
                    "We return your laundry promptly, beautifully cleaned, folded, and ready to wear. It’s like opening a gift from yourself — fresh, tidy, and just the way you like it.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`md:w-1/2 p-6 ${
                      index % 2 === 0
                        ? "md:pr-[0px] md:text-right"
                        : "md:pl-[0px] md:text-left"
                    }`}
                  >
                    <div className="inline-flex flex-col items-center bg-[#000980] text-white rounded-full w-16 h-16 justify-center mb-4">
                      <span className="text-[14px] font-semibold">
                        {item.step}
                      </span>
                    </div>
                    <div
                      className={` md:mt-[-100px] ${
                        index % 2 === 0
                          ? "md:mr-[70px] py-2 pr-5 border-r-4 lg:border-0 md:border-0  border-[#0ba5c6] md:text-right"
                          : "md:ml-[70px] py-2 pl-5 border-l-4 lg:border-0 md:border-0  border-[#0ba5c6] md:text-left"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-[#000980]">
                        {item.title}
                      </h3>
                      <p className="text-[#64748b] mt-2 ">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#0b46c6] text-center mt-8"
          >
            <h2 className="font-semibold text-3xl">All within a week</h2>
          </motion.div>
        </div>
      </div>

      <section className="py-20 px-6  bg-gradient-to-br from-[#005aa817] via-[#005aa836] to-[#005aa86c]">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-[#000980] drop-shadow-lg">
          What Our Customers Say
        </h2>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-700 ease-in-out">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  scale: index === currentIndex ? 1 : 0.9,
                  display: index === currentIndex ? "block" : "none",
                }}
                transition={{ duration: 0.5 }}
                className="w-full flex-shrink-0 px-4"
              >
                <div className="bg-[#eef8ff70] backdrop-blur-md p-10 rounded-2xl shadow-inner max-w-2xl mx-auto relative border border-blue-100">
                  <svg
                    className="w-12 h-12 text-[#0BA5C6] opacity-30 absolute top-4 left-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="italic text-xl mb-6 text-center px-8 text-gray-800 leading-relaxed">
                    “{testimonial.quote}”
                  </p>
                  <p className="font-semibold text-[#0A6FC2] text-center text-lg">
                    – {testimonial.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-4 rounded-full shadow-md hover:bg-[#0BA5C6] hover:text-white transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-[#0BA5C6]/30"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-4 rounded-full shadow-md hover:bg-[#0BA5C6] hover:text-white transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-[#0BA5C6]/30"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex justify-center my-10 space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0BA5C6]/50 ${
                  index === currentIndex
                    ? "bg-[#0A6FC2] scale-125 shadow-md"
                    : "bg-gray-300 hover:bg-[#0BA5C6]"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#002394] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Simplify Your Laundry?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of happy customers who've made laundry day effortless
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/order"
              className="px-8 py-4 bg-[#0BA5C6] hover:bg-[#0A6FC2] rounded-full text-white font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-[#0BA5C6]/50 flex items-center justify-center gap-2 text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Start Your Order
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-white/10 flex items-center justify-center gap-2 text-lg border border-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

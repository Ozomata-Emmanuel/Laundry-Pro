import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`
            bg-[#222058] hover:bg-[#222058c2] text-white
            rounded-full w-12 h-12 flex items-center justify-center
            shadow-lg transition-all duration-300
            transform hover:scale-110 focus:outline-none
          `}
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
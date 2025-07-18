import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <div className="h-screen top-0 w-full absolute z-50 flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        <h1 className="text-6xl z-50 font-bold text-indigo-600">404</h1>
        <p className="mt-4 z-50 text-xl text-gray-700">Oops! Page not found.</p>
        <p className="mt-2 z-50 text-gray-500">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 z-50 inline-block px-6 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(80)].map((_, i) => {
            const size = Math.random() * 140 + 40 + 10;
            const delay = Math.random() * 5;
            const duration = Math.random() * 15 + 10;
            const left = Math.random() * 100;
            const bottom = -size;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-blue-500/40 opacity-20"
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
    </div>
  );
};

export default NotFound;

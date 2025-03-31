import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-beige px-4">
      <div className="glass-card rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-bebas text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6 font-montserrat">Page not found</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-carney to-poilievre text-white font-medium rounded-lg transition-transform hover:scale-105"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

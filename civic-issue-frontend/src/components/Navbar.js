import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Civic Issue Reporter
        </h1>
        <p className="text-gray-600 mt-1">
          Report and track civic issues in your community
        </p>

        {/* Navigation Links */}
        <nav className="mt-4 flex space-x-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isActive("/")
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Report Issue
          </Link>
          <Link
            to="/my-issues"
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isActive("/my-issues")
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            My Issues
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

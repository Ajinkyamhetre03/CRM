import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

const PublicLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/20 text-gray-800 dark:text-gray-200 px-6 py-4 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            MyCompany
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-6 font-medium">
            {["Home", "About", "Service", "Portfolio", "Resources", "Contact", "Careers"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    className="hover:text-blue-500 transition"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Login Button */}
          <Link
            to="/login"
            className="hidden md:block px-4 py-2 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 px-4 pb-4">
            {["Home", "About", "Services", "Portfolio", "Resources", "Contact", "Careers"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              )
            )}
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border-t border-white/20 text-gray-600 dark:text-gray-300 text-center py-4">
        © {new Date().getFullYear()} My Company. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLayout;

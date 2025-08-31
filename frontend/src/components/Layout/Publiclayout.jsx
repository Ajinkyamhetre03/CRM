import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";

const PublicLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/service" },
    { name: "Products", path:"/products"},
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
    { name: "Careers", path: "/careers" }
    
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Single Main Navbar - Fixed */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Zyntarix
                </span>
                <div className="text-xs text-gray-500 font-medium">Technologies</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 group ${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform transition-transform duration-300 ${
                    location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            {/* <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/contact"
                className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Get Quote
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            </div> */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-lg">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <Link
                  to="/contact"
                  className="block w-full text-center px-4 py-3 text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Get Quote
                </Link>
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content with top padding to account for fixed navbar */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Z</span>
                </div>
                <span className="text-xl font-bold">Zyntarix Technologies</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Leading technology solutions provider with industry-focused programs and hands-on learning experiences.
              </p>
              <p className="text-gray-300 leading-relaxed"><a href="/login" >
                Connect with our Organization
                </a> 
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-300 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">IoT Solutions</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Software Development</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Industry 4.0</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">info@zyntarix.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">+91-9876543210</span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-6 border-t border-gray-700 text-center">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Zyntarix Technologies. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

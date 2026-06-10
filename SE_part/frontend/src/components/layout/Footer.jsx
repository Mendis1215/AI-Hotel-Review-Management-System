import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <img src="/src/assets/logo.png" alt="Y&I Villa Logo" className="h-10 w-auto object-contain opacity-70" />
          <p className="text-text-muted mt-2 text-sm">© {new Date().getFullYear()} Y&I Villa. All rights reserved.</p>
        </div>
        
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="text-text-muted hover:text-accent transition">Home</Link>
          <Link to="/about" className="text-text-muted hover:text-accent transition">About Us</Link>
          <Link to="/contact" className="text-text-muted hover:text-accent transition">Contact</Link>
          <Link to="/staff/login" className="text-accent-dark hover:text-accent transition font-medium">Staff Portal</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

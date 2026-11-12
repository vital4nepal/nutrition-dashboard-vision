import React from 'react';
import { Link } from 'react-router-dom';
import sidartLogo from '../../nutrition_logo333.png';
import { Mail, Phone, MapPin, FileText, BookOpen, FileSpreadsheet } from 'lucide-react';

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/output', label: 'Output Analysis' },
    { path: '/impact', label: 'Impact Analysis' },
    { path: '/profile', label: 'Profile' },
    { path: '/about', label: 'About Us' },
  ];

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link to="/" onClick={handleClick} className="flex items-center space-x-2">
                <img src={sidartLogo} alt="Sidart Foundation Logo" className="h-8" />
                <span className="text-xl font-semibold text-[#22C55E]">NutriPulse</span>
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} NutriPulse Nepal. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-[#22C55E] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-[#22C55E] flex-shrink-0" />
                <span className="break-all">nutfellowship@gmail.com</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-[#22C55E] flex-shrink-0" />
                <span>+977-1-4XXXXXX</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-[#22C55E] flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/technical-specs"
                  onClick={handleClick}
                  className="flex items-center text-sm text-gray-600 hover:text-[#22C55E] transition-colors group"
                >
                  <FileText className="h-4 w-4 mr-2 group-hover:text-[#22C55E] transition-colors" />
                  <span>Technical Specifications</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/data-import"
                  onClick={handleClick}
                  className="flex items-center text-sm text-gray-600 hover:text-[#22C55E] transition-colors group"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2 group-hover:text-[#22C55E] transition-colors" />
                  <span>Data Guidelines</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/technical-specs"
                  onClick={handleClick}
                  className="flex items-center text-sm text-gray-600 hover:text-[#22C55E] transition-colors group"
                >
                  <BookOpen className="h-4 w-4 mr-2 group-hover:text-[#22C55E] transition-colors" />
                  <span>Methodology Guide</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
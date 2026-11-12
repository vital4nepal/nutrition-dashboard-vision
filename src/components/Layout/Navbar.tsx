import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sidartLogo from '../../nutrition_logo333.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isMenuOpen ? 'unset' : 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Output Analysis', path: '/output' },
    { name: 'Impact Analysis', path: '/impact' },
    { name: 'N4G Dashboard', path: '/n4g-dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Import Data', path: '/data-import' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <nav className="bg-white shadow-sm fixed top-0 w-full z-50">
      <div className="w-full px-4">
        <div className="flex justify-between h-16 max-w-[98%] mx-auto">
          <div className="flex-shrink-0 flex items-center pl-0">
            <Link to="/" onClick={closeMenu}>
              <img className="h-8 w-auto" src={sidartLogo} alt="NutriPulse Nepal Logo" />
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-auto pr-0 space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? 'default' : 'ghost'}
                  className={`${
                    isActive(link.path)
                      ? 'bg-[#22C55E] hover:bg-[#16A34A] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } px-3 py-2 text-sm font-medium`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              onClick={toggleMenu} 
              className="inline-flex items-center justify-center p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 sm:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      >
        <div 
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="pt-16 pb-3 space-y-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'bg-[#22C55E] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

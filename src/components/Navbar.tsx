import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/learnomic.png';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    // Check if user is logged in (you can replace this with your actual auth check)
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove auth token
    setIsLoggedIn(false);
    navigate('/');
  };

  // Define the active and inactive styles
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium";
    const activeClasses = "text-indigo-700 bg-indigo-50";
    const inactiveClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-50";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto pr-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Learnomic Logo" className="w-35 ml-[-15px]" />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-900 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <NavLink to="/" className={navLinkClasses} end>
              Home
            </NavLink>
            <NavLink to="/subjects" className={navLinkClasses}>
              Subjects
            </NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/profile" className={navLinkClasses}>
                  <FaUserCircle className="inline-block mr-1" />
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClasses}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClasses}>
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Mobile menu slide-in panel */}
      <div 
        className={`fixed top-0 right-0 w-[70%] h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="px-4 pt-4 pb-6 space-y-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `block px-3 py-3 rounded-md text-base font-medium ${
                isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
            end
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/subjects" 
            className={({ isActive }) => 
              `block px-3 py-3 rounded-md text-base font-medium ${
                isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Subjects
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium ${
                    isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserCircle className="inline-block mr-2" />
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FaSignOutAlt className="inline-block mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium ${
                    isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink 
                to="/signup" 
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium ${
                    isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 
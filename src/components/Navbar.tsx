import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/learnomic.png';

const Navbar: React.FC = () => {
  // Define the active and inactive styles
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium";
    const activeClasses = "text-indigo-700 bg-indigo-50";
    const inactiveClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-50";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-green-50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <img src={logo} alt="Learnomic Logo" className="w-36" />
            {/* <Link to="/" className="text-xl font-bold text-indigo-600">Learnomic</Link> */}
          </div>
          <nav className="flex space-x-4">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/profile" className={navLinkClasses}>
              Profile
            </NavLink>
            <NavLink to="/login" className={navLinkClasses}>
              Login
            </NavLink>
            <NavLink to="/signup" className={navLinkClasses}>
              Sign Up
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 
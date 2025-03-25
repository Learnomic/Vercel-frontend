import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/learnomic.png';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

interface UserData {
  name: string;
  email: string;
  grade: string;
  board: string;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user');
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    // Initial check
    checkAuth();
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAuth();
      }
    };

    // Add event listener for custom login event
    const handleLoginEvent = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('logout', handleLoginEvent);

    // Check auth status every time component mounts
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLoginEvent);
      window.removeEventListener('logout', handleLoginEvent);
      clearInterval(interval);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setIsProfileOpen(false);
    // Dispatch logout event
    window.dispatchEvent(new Event('logout'));
    navigate('/');
  };

  // Define the active and inactive styles with popup animation
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = "px-3 py-2 rounded-none text-lg primary-gradient font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg";
    const activeClasses = "text-indigo-700 bg-indigo-50 bg-opacity-70 border-b-2 border-indigo-700";
    const inactiveClasses = "text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:bg-opacity-70";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="  bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full mx-auto pr-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Learnomic Logo" className="w-35 mr-[10px] ml-[-45px]" />
              <h1 className="text-4xl font-bold ml-[-20px] primary-gradient primary-font">Learnomic</h1>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-900 hover:text-gray-500 hover:bg-gray-100 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
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
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8AB4F8] text-white font-medium text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg  focus:outline-none"
                >
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/90 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 transform transition-all duration-300">
                    <div className="p-4 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-[#8AB4F8] flex items-center justify-center text-white text-2xl font-medium">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userData?.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {userData?.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg">
                      <Link
                        to="/profile"
                        className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaCog className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        Manage your Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:bg-opacity-70 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClasses}>
                Login
              </NavLink>
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
        className={`fixed top-0 right-0 w-[70%] h-full bg-white/90  shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 bg-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="px-4 pt-4 pb-6 space-y-2 bg-white">
          {isLoggedIn ? (
            <>
              <div className="flex items-center px-3 py-3">
                <NavLink to="/profile" className="flex items-center"
                 onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-[#8AB4F8] flex items-center justify-center text-white text-lg font-medium mr-3">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{userData?.email || 'No email provided'}</p>
                  </div>
                </NavLink>
              </div>

              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${
                    isActive ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-700' : 'text-gray-700 hover:text-gray-900 bg-gray-50'
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
                  `block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${
                    isActive ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-700' : 'text-gray-700 bg-white hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Subjects
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
              >
                <FaSignOutAlt className="inline-block mr-2" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${
                    isActive ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-700' : 'text-gray-700 hover:text-gray-900 bg-gray-50'
                  }`
                }
                end
                onClick={() => setIsMenuOpen(false)}
              > 
                Home
              </NavLink>

              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${
                    isActive ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-700' : 'text-gray-700 hover:text-gray-900 bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 
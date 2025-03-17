import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { authService } from '../services/apiServices';
import logo from '../assets/learnomic.png';
import sideImage from '../assets/sinupsideimage.jpg';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login(formData.email, formData.password);
      
      // Store tokens and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to home page or dashboard
      navigate('/');

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ApiError>;
        const serverError = error.response?.data;
        
        if (serverError?.message) {
          setError(serverError.message);
        } else if (serverError?.errors) {
          // Handle validation errors
          const errorValues = Object.values(serverError.errors || {});
          const firstErrorArray = errorValues.length > 0 ? errorValues[0] : [];
          const firstError = firstErrorArray.length > 0 ? firstErrorArray[0] : 'Invalid credentials';
          setError(firstError);
        } else if (error.response?.status === 401) {
          setError('Invalid email or password');
        } else if (error.response?.status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else if (!error.response) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffff] flex  justify-center p-4">
      <div className="w-full max-w-[1000px] h-auto md:h-[600px] bg-white  shadow-xl flex overflow-hidden">
        {/* Left side - Purple section with illustration */}
        <div className="hidden md:block w-1/2 bg-[#6161FF] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6161FF] to-[#897BFF]">
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
                    <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.05 }} />
                  </linearGradient>
                </defs>
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grad)" />
                <path d="M0,50 Q25,45 50,50 T100,50" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,60 Q25,55 50,60 T100,60" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0,70 Q25,65 50,70 T100,70" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
          </div>
          
          {/* Illustration container */}
          <div className="relative z-10 h-full flex items-center justify-center p-8">
            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-3xl p-4 shadow-xl">
              <img 
                src={sideImage} 
                alt="Login" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-12 right-12 w-8 h-8 bg-yellow-300 rounded-full opacity-75 blur-sm"></div>
            <div className="absolute bottom-12 left-12 w-6 h-6 bg-blue-400 rounded-full opacity-75 blur-sm"></div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-center">
              <img src={logo} alt="Learnomic Logo" className="w-32 drop-shadow" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/signup" className="font-medium text-[#0EA9E1] hover:text-[#1D2160]">
                create a new account
              </Link>
            </p>

            <div className="mt-6">
              {error && (
                <div className="mb-4 bg-red-500/10 border-l-4 border-red-500 p-4 text-red-600">
                  <p>{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)] focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm"
                  />
                </div>

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)] focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#0EA9E1] focus:ring-[#0EA9E1]"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#0EA9E1] hover:text-[#1D2160]">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-[#1D2160] to-[#0EA9E1] py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA9E1] focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 mt-6"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
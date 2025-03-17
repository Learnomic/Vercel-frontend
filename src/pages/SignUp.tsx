import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { authService } from "../services/apiServices";
import logo from "../assets/learnomic.png";
import sideImage from "../assets/sinupsideimage.jpg";

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

   
  const validateForm = (): boolean => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.terms
    ) {
      setError("Please fill in all fields and accept the terms");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Store registration data in localStorage
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
    
    // Redirect to board selection
    navigate('/board-selection');
  };

  return (
    <div className="min-h-screen bg-[#fffff] flex  justify-center p-4">
      <div className="w-full max-w-[1000px] h-auto md:h-[600px] bg-white shadow-xl flex overflow-hidden">
        {/* Left side - Sign up form */}
        <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-center">
              <img src={logo} alt="Learnomic Logo" className="w-32 drop-shadow" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Create a new account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link to="/login" className="font-medium text-[#0EA9E1] hover:text-[#1D2160]">
                sign in to your existing account
              </Link>
            </p>

            <div className="mt-6">
              {error && (
                <div className="mb-4 bg-red-500/10 border-l-4 border-red-500 p-4 text-red-600">
                  <p>{error}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Student Name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm"
                  />
                </div>

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
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm"
                  />
                </div>

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm"
                  />
                </div>

                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={formData.terms}
                    onChange={handleCheckboxChange}
                    disabled={isLoading}
                    className="h-4 w-4 text-[#0EA9E1] focus:ring-[#0EA9E1] border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link to="/terms" className="font-medium text-[#0EA9E1] hover:text-[#1D2160]">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="font-medium text-[#0EA9E1] hover:text-[#1D2160]">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-[#1D2160] to-[#0EA9E1] py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA9E1] focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 mt-6"
                  >
                    {isLoading ? "Signing up..." : "Sign up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Purple section with illustration */}
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
                alt="Sign Up" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-12 right-12 w-8 h-8 bg-yellow-300 rounded-full opacity-75 blur-sm"></div>
            <div className="absolute bottom-12 left-12 w-6 h-6 bg-blue-400 rounded-full opacity-75 blur-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

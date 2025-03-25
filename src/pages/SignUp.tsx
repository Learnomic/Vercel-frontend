import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/learnomic.png";
import sideImage from "../assets/sinupsideimage.jpg";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      // Store registration data in localStorage
      const registrationData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      // Redirect to board selection
      navigate('/board-selection');
    } catch (error) {
      console.error('Error during signup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffff] flex justify-center p-4">
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
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  terms: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-blue-500" />
                      </div>
                      <Field
                        name="name"
                        type="text"
                        className={`block w-full pl-10 appearance-none rounded-md border ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm`}
                        placeholder="Student Name"
                      />
                    </div>
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-[-15px]" />

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-blue-500" />
                      </div>
                      <Field
                        name="email"
                        type="email"
                        className={`block w-full pl-10 appearance-none rounded-md border ${
                          errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm`}
                        placeholder="Email address"
                      />
                    </div>
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-[-15px]" />

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-blue-500" />
                      </div>
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`block w-full pl-10 pr-10 appearance-none rounded-md border ${
                          errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm`}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-blue-500" />
                        ) : (
                          <FaEye className="h-5 w-5 text-blue-500" />
                        )}
                      </button>
                    </div>
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-[-15px]" />

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-blue-500" />
                      </div>
                      <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`block w-full pl-10 pr-10 appearance-none rounded-md border ${
                          errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-[#0EA9E1] focus:outline-none focus:ring-1 focus:ring-[#0EA9E1] sm:text-sm`}
                        placeholder="Confirm Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-blue-500" />
                        ) : (
                          <FaEye className="h-5 w-5 text-blue-500" />
                        )}
                      </button>
                    </div>
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-[-15px]" />

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="terms"
                        className="h-4 w-4 text-[#0EA9E1] focus:ring-[#0EA9E1] border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
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
                      <ErrorMessage name="terms" component="div" className="text-red-500 text-sm mt-[-15px]" />

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-[#1D2160] to-[#0EA9E1] py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA9E1] focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 mt-6"
                      >
                        {isLoading ? "Signing up..." : "Sign up"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
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

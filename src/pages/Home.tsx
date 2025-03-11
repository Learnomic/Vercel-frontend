import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../components/Features';
import educationImage from '../assets/education.jpg';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section 
        className="h-[90vh] py-10 bg-cover bg-center relative flex items-center"
        style={{ backgroundImage: `url(${educationImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="text-center relative z-10 w-full">
            <style>
          {`
            .brand-gradient-text {
              background: linear-gradient(90deg, #87D031 0%, #0EA9E1 50%, #B437B9 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
            }
          `}
        </style>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl ">
            Welcome to Learnomic
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-200">
            Your platform for continuous learning and growth
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/start-learning"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white "
            >
              Start Learning
            </Link>
            <Link
              to="/signup" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      <Features />

      <section className="bg-white shadow rounded-lg p-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of learners who have already taken the first step towards their goals.
            Get access to expert-led courses, interactive exercises, and a supportive community.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 
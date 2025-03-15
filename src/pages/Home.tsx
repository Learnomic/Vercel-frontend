import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Features from '../components/Features';
import educationImage from '../assets/education.jpg';
import mobileImage from '../assets/mobileImg.jpg';

const Home: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState(educationImage);

  useEffect(() => {
    const handleResize = () => {
      setBackgroundImage(window.innerWidth < 640 ? mobileImage : educationImage);
    };
    
    // Set initial background image
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-down animate-once animate-duration-1000">
      <section 
        className="min-h-[100vh] sm:min-h-[80vh] sm:h-screen py-8 sm:py-10 bg-cover bg-center relative flex items-center justify-center text-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome to Learnomic
          </h1>
          <p className="mt-3 sm:mt-5 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-gray-200">
            Your platform for continuous learning and growth
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/start-learning"
              className=" btn-gradient px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              Start Learning
            </Link>
            <Link
              to="/signup"
              className="bg-white text-indigo-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Start Your Learning Journey Today
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
              Explore our comprehensive curriculum designed to help you excel in your studies.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link
                to="/start-learning"
                className="btn-gradient px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Features />
    </div>
  );
};

export default Home; 
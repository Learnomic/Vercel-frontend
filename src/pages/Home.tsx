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
      {/* <section 
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
              to="/subjects"
              className=" btn-gradient px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              Start Learning
            </Link>
           
          </div>
        </div>
      </section> */}
      <section className="bg-gray-900 text-white"
        >
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div className="mx-auto max-w-3xl text-center">
      <h1
        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
      >
        Welcome to Learnomic

        {/* <span className="sm:block"> Increase Conversion. </span> */}
      </h1>

      <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
      Your platform for continuous learning and growth
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {/* <a
          className="block w-full rounded-sm border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:ring-3 focus:outline-hidden sm:w-auto"
          href="#"
        >
          Get Started
        </a> */}
        <button className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-white text-blue-800 font-bold  hover:text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 rounded-full before:rounded-full before:bg-blue-600 before:duration-700 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56">
                                <span className=" z-10"> Get Started</span>
                            </button>
        {/* <a
          className="block w-full rounded-sm border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:ring-3 focus:outline-hidden sm:w-auto"
          href="#"
        >
          Learn More
        </a> */}
      </div>
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

// import React from 'react';
// import { Link } from 'react-router-dom';
// import Features from '../components/Features';
// // import educationImage from '../assets/hero.jpg';
// import { motion } from 'framer-motion';
// import { Brain, Sparkles, Activity, Wand2, Globe, Lightbulb, Rocket } from 'lucide-react';
// import Translator from '../components/Translator';


// const Home: React.FC = () => {
 
//   return (
//     <div
//     // className="space-y-8 sm:space-y-12 animate-fade-down animate-once animate-duration-1000"
//     >

//       <div className="w-full mx-auto px-6 md:px-12 py-9 md:py-10 bg-gradient-to-br from-slate-50 via-blue-100 to-blue-200">
//         <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
//           {/* Left Section */}
//           {/* <Translator/> */}

//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7, delay: 0.5 }}
//             className="w-full md:w-2/5 relative mt-12 md:mt-0"
//           >
//             <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-blue-300 to-blue-400 rounded-2xl blur-xl opacity-50"></div>
//             <motion.div
//               className="relative z-10"
//               whileHover={{
//                 scale: 1.02,
//                 transition: { duration: 0.2 }
//               }}
//             >
//               <img
//                 src="https://learnomicstorage.blob.core.windows.net/learnomicstorage/hero.jpg?sp=r&st=2025-04-08T06:35:52Z&se=2026-04-01T14:35:52Z&spr=https&sv=2024-11-04&sr=b&sig=8ILv0EBvSYUho9ng24UJGf58LKzsKgyKM9yXFKcO14c%3D"
//                 alt="Interactive mental health support platform visualization with AI-powered therapeutic elements"
//                 className="w-full h-auto object-fill rounded-md bg-white p-0.5 shadow-lg"
//                 loading="lazy"
//               />
//             </motion.div>
//             {/* <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4, delay: 1 }}
//                 className="absolute -bottom-2 -right-14 bg-white p-4 rounded-2xl shadow-lg z-20 hidden md:flex items-center gap-3"
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                   transition: { duration: 0.3 }
//                 }}
//               >
              
//               </motion.div> */}
//           </motion.div>

//           {/* Right Section */}
//           <div className="w-full md:w-1/2 space-y-8 text-center md:text-left md:ml-22">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="flex items-center gap-2 mb-2"
//             >
//               <Brain className="text-blue-800" size={28} />
//               <span className="text-sm font-medium bg-blue-200 text-blue-800 px-3 py-1 rounded-full">AI-Powered Video Education</span>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-5xl md:text-6xl font-bold leading-tight"
//             >
//               <span className=" flex items-center">INTERACTIVE
//               </span>
//               <span className=" primary-gradient flex items-center gap-2">
//                 LEARNING
//                 <Sparkles className="primary-gradient" size={30} />
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="text-gray-700 leading-relaxed text-lg"
//             >
//               <span className="font-semibold">
//                 Transform your learning experience with our
//               </span>{" "}
//               <span className="italic font-mono text-blue-800">video-based platform.</span>.
//               <span className="font-semibold">
//                 {" "}  We combine
//                 engaging video content with AI-powered quiz generation to provide a personalized
//                 learning journey tailored to your comprehension level. Watch videos, generate
//                 quizzes based on what you've learned, and track your progress - making knowledge
//                 retention effective, interactive, and accessible for everyone.
//               </span>
//             </motion.p>



//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//               className="pt-6"
//             >
//               {/* <Link
//               to="/services"
//               className="btn-gradient text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 hover:bg-blue-800 transition-all duration-300 shadow-md shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:translate-y-[-2px]"
//               aria-label="Explore our mental health services"
//             >
//               Get Started <ChevronRight size={16} />
//             </Link> */}
//               <Link to="/subjects">

//                 <button className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-white text-blue-800 font-bold  hover:text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 rounded-full before:rounded-full before:bg-blue-600 before:duration-700 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56">
//                   <span className=" z-10"> Get Started</span>
//                 </button>
//               </Link>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.8 }}
//               className="pt-8 flex gap-6 justify-center md:justify-start flex-wrap"
//             >
//               <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
//                 <Activity className="text-blue-600 mb-2" size={20} />
//                 <span className="text-sm text-gray-700">Video-Based</span>
//               </div>
//               <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
//                 <Wand2 className="text-purple-600 mb-2" size={20} />
//                 <span className="text-sm text-gray-700">AI-Generated Quizzes</span>
//               </div>
//               <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
//                 <Globe className="text-green-600 mb-2" size={20} />
//                 <span className="text-sm text-gray-700">Progress Tracking</span>
//               </div>
//               <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
//                 <Lightbulb className="text-yellow-600 mb-2" size={20} />
//                 <span className="text-sm text-gray-700"> Interactive</span>
//               </div>
//               <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
//                 <Rocket className="text-red-600 mb-2" size={20} />
//                 <span className="text-sm text-gray-700">Self-Paced</span>
//               </div>
//             </motion.div>
//           </div>

//         </div>
//       </div>
//       {/* <section className="py-8 sm:py-12 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Start Your Learning Journey Today
//             </h2>
//             <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600">
//               Explore our comprehensive curriculum designed to help you excel in your studies.
//             </p>
//             <div className="mt-6 sm:mt-8">
//               <Link
//                 to="/start-learning"
//                 className="btn-gradient px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
//               >
//                 Get Started Today
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section> */}

//       <Features />
//     </div>
//   );
// };

// export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../components/Features';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Activity, Wand2, Globe, Lightbulb, Rocket } from 'lucide-react';
import Translator from '../components/Translator';

const Home: React.FC = () => {
  return (
    <div>
      {/* Header with Translator positioned at top right */}
      <div className="absolute top-16 right-0 z-10">
        <Translator />
      </div>

      <div className="w-full mx-auto px-6 md:px-12 py-9 md:py-10 bg-gradient-to-br from-slate-50 via-blue-100 to-blue-200">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full md:w-2/5 relative mt-12 md:mt-0"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-blue-300 to-blue-400 rounded-2xl blur-xl opacity-50"></div>
            <motion.div
              className="relative z-10"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <img
                src="https://learnomicstorage.blob.core.windows.net/learnomicstorage/hero.jpg?sp=r&st=2025-04-08T06:35:52Z&se=2026-04-01T14:35:52Z&spr=https&sv=2024-11-04&sr=b&sig=8ILv0EBvSYUho9ng24UJGf58LKzsKgyKM9yXFKcO14c%3D"
                alt="Interactive mental health support platform visualization with AI-powered therapeutic elements"
                className="w-full h-auto object-fill rounded-md bg-white p-0.5 shadow-lg"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 space-y-8 text-center md:text-left md:ml-22">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <Brain className="text-blue-800" size={28} />
              <span className="text-sm font-medium bg-blue-200 text-blue-800 px-3 py-1 rounded-full">AI-Powered Video Education</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              <span className="flex items-center">INTERACTIVE
              </span>
              <span className="primary-gradient flex items-center gap-2">
                LEARNING
                <Sparkles className="primary-gradient" size={30} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-700 leading-relaxed text-lg"
            >
              <span className="font-semibold">
                Transform your learning experience with our
              </span>{" "}
              <span className="italic font-mono text-blue-800">video-based platform.</span>.
              <span className="font-semibold">
                {" "}  We combine
                engaging video content with AI-powered quiz generation to provide a personalized
                learning journey tailored to your comprehension level. Watch videos, generate
                quizzes based on what you've learned, and track your progress - making knowledge
                retention effective, interactive, and accessible for everyone.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-6"
            >
              <Link to="/subjects">
                <button className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-white text-blue-800 font-bold hover:text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 rounded-full before:rounded-full before:bg-blue-600 before:duration-700 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56">
                  <span className="z-10"> Get Started</span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="pt-8 flex gap-6 justify-center md:justify-start flex-wrap"
            >
              <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
                <Activity className="text-blue-600 mb-2" size={20} />
                <span className="text-sm text-gray-700">Video-Based</span>
              </div>
              <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
                <Wand2 className="text-purple-600 mb-2" size={20} />
                <span className="text-sm text-gray-700">AI-Generated Quizzes</span>
              </div>
              <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
                <Globe className="text-green-600 mb-2" size={20} />
                <span className="text-sm text-gray-700">Progress Tracking</span>
              </div>
              <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
                <Lightbulb className="text-yellow-600 mb-2" size={20} />
                <span className="text-sm text-gray-700"> Interactive</span>
              </div>
              <div className="flex flex-col items-center md:items-start hover:scale-105 transition-transform duration-300">
                <Rocket className="text-red-600 mb-2" size={20} />
                <span className="text-sm text-gray-700">Self-Paced</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Features />
    </div>
  );
};

export default Home;
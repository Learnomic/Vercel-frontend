import React from 'react';
import { FaChalkboardTeacher, FaHandsHelping, FaClock
  // , FaBullseye, FaUsers, FaGraduationCap 
} from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    title: 'Quizzes and Tests',
    description: 'Test your knowledge with interactive quizzes and tests.',
    icon: FaChalkboardTeacher
  },
  {
    title: 'Hands-On Learning',
    description: 'Learn through hands-on activities and exercises.',
    icon: FaHandsHelping
  },
  {
    title: 'Flexible Schedule',
    description: 'Study at your own pace, anytime and anywhere.',
    icon: FaClock
  },
  // {
  //   title: 'Personalized Learning',
  //   description: 'Get customized recommendations based on your progress.',
  //   icon: FaBullseye
  // },
  // {
  //   title: 'Community Support',
  //   description: 'Connect with fellow learners and share experiences.',
  //   icon: FaUsers
  // },
  // {
  //   title: 'Certified Courses',
  //   description: 'Earn recognized certificates upon completion.',
  //   icon: FaGraduationCap
  // }
];

const Features: React.FC = () => {
  // Create refs for the different sections
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  
  // Check if sections are in view
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.5 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.2 });

  // Container animation variant
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  // Item animation variant
  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Icon animation variant
  const iconVariant = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
        delay: 0.2
      }
    }
  };

  // Title animation variant
  const titleVariant = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      ref={sectionRef}
      id="features"
      className="py-8 sm:py-12 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={headingRef}
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900"
            variants={titleVariant}
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
          >
            Why Choose Learnomic?
          </motion.h2>
          <motion.p 
            className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={isHeadingInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover the features that make our platform unique
          </motion.p>
        </motion.div>
        
        <motion.div 
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariant}
          initial="hidden"
          animate={isGridInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white overflow-hidden shadow-md hover:shadow-lg rounded-lg transition-shadow duration-300 p-4 sm:p-6"
              variants={itemVariant}
              whileHover={{ 
                scale: 1.03, 
                transition: { duration: 0.2 } 
              }}
            >
              <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-4">
                <motion.div 
                  className="text-indigo-600 mb-3 sm:mb-0"
                  variants={iconVariant}
                >
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                </motion.div>
                <div className="text-center sm:text-left">
                  <motion.h3 
                    className="text-lg sm:text-xl font-semibold text-gray-900 mb-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { delay: 0.3, duration: 0.5 } }
                    }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-sm sm:text-base text-gray-600"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { delay: 0.4, duration: 0.5 } }
                    }}
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
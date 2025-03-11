import React from 'react';
import { FaChalkboardTeacher, FaHandsHelping, FaClock, FaBullseye, FaUsers, FaGraduationCap } from 'react-icons/fa';

const features = [
  {
    title: 'Expert Instructors',
    description: 'Learn from industry professionals and experienced educators.',
    icon: FaChalkboardTeacher
  },
  {
    title: 'Interactive Learning',
    description: 'Engage with hands-on exercises and real-world projects.',
    icon: FaHandsHelping
  },
  {
    title: 'Flexible Schedule',
    description: 'Study at your own pace, anytime and anywhere.',
    icon: FaClock
  },
  {
    title: 'Personalized Learning',
    description: 'Get customized recommendations based on your progress.',
    icon: FaBullseye
  },
  {
    title: 'Community Support',
    description: 'Connect with fellow learners and share experiences.',
    icon: FaUsers
  },
  {
    title: 'Certified Courses',
    description: 'Earn recognized certificates upon completion.',
    icon: FaGraduationCap
  }
];

const Features: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose Learnomic?</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
            Discover the features that make our platform unique
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white overflow-hidden shadow-md hover:shadow-lg rounded-lg transition-shadow duration-300 p-4 sm:p-6"
            >
              <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-4">
                <div className="text-indigo-600 mb-3 sm:mb-0">
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features; 
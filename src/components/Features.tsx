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
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Learnomic?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover the features that make our platform unique
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="text-indigo-600 mb-4">
                  <feature.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllSubjects } from '../services/apiServices';
import { FaSpinner } from 'react-icons/fa';

// Import subject images
import mathImage from '../assets/MATH.jpg';
import biologyImage from '../assets/BIOLOGY.jpeg';
import physicsImage from '../assets/PHYSICS.jpg';
import chemistryImage from '../assets/CHEMSTRY.jpg';
import defaultImage from '../assets/education.jpg';

// Map subject names to their corresponding images
const getSubjectImage = (subjectName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Mathematics': mathImage,
    'MATHEMATICS': mathImage,
    'MATH': mathImage,
    'Biology': biologyImage,
    'BIOLOGY': biologyImage,
    'Physics': physicsImage,
    'PHYSICS': physicsImage,
    'Chemistry': chemistryImage,
    'CHEMISTRY': chemistryImage
  };
  return imageMap[subjectName] || defaultImage;
};

// Helper function to convert numeric grade to text
const convertGradeToText = (grade: string): string => {
  const gradeMap: { [key: string]: string } = {
    '1': 'ONE',
    '2': 'TWO',
    '3': 'THREE',
    '4': 'FOUR',
    '5': 'FIVE',
    '6': 'SIX',
    '7': 'SEVEN',
    '8': 'EIGHT',
    '9': 'NINE',
    '10': 'TEN',
    '11': 'ELEVEN',
    '12': 'TWELVE'
  };
  return gradeMap[grade] || grade.toUpperCase();
};

// Helper function to format subject name for URL
const formatSubjectForUrl = (subject: string): string => {
  if (subject.toLowerCase() === 'mathematics') {
    return 'MATH';
  }
  return subject.toUpperCase().replace(/\s+/g, '%20');
};

interface SubjectCardProps {
  id: string | number;
  name: string;
  imageUrl?: string;
  description?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  id, 
  name, 
  imageUrl,
  description
}) => {
  const navigate = useNavigate();

  // Get the local image based on subject name
  const subjectImage = getSubjectImage(name);

  const handleSubjectClick = () => {
    // Format the subject name and navigate to the playlists page
    const formattedSubject = formatSubjectForUrl(name);
    navigate('/showPlaylist', { state: { subject: formattedSubject } });
  };

  const cardContent = (
    <div 
      onClick={handleSubjectClick}
      className="group h-full flex flex-col overflow-hidden rounded-lg shadow-xl transition-all duration-300 hover:shadow-purple-100 bg-white cursor-pointer "
    >
      <div className="flex-shrink-0 relative h-48 overflow-hidden">
        <img 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          src={subjectImage}
          alt={name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
            {name}
          </h3>
          {description && (
            <p className="mt-3 text-base text-gray-500 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
            Explore subject →
          </div>
        </div>
      </div>
    </div>
  );

  return cardContent;
};

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setUserData(user);
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await GetAllSubjects();
        console.log('API Response:', response.data);
        
        // Ensure we're getting the correct data structure
        const subjectsData = Array.isArray(response.data) ? response.data : [];
        setSubjects(subjectsData);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load subjects. Please try again later.');
        }
        setLoading(false);
      }
    };

    if (userData) {
      fetchSubjects();
    }
  }, [navigate, userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-22  pt-6 pb-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 ">All Subjects</h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
          Explore our comprehensive collection of subjects and start learning today
        </p>
        {userData && (
          <p className="mt-2 text-sm text-indigo-600">
            {userData.board} - Grade {userData.grade}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 ">
        {subjects.map((subject, index) => (
          <SubjectCard
            key={`${subject.name}-${index}`}
            id={subject.id || index}
            name={subject.name}
            imageUrl={subject.imageUrl}
            description={subject.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectCard;

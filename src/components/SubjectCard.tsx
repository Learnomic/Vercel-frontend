import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../services/apiServices';
import { FaSpinner } from 'react-icons/fa';
import apiClient from '../services/apiClient';

// Assigned blob azure img to variables
const mathImage = "https://learnomicstorage.blob.core.windows.net/learnomicstorage/MATH.jpg?sp=r&st=2025-04-08T06:44:14Z&se=2026-04-01T14:44:14Z&spr=https&sv=2024-11-04&sr=b&sig=EvT45eNFgycnQzLsSdUp0cGTMAWsqSsfJ9%2FoOIICdAA%3D"
const biologyImage = "https://learnomicstorage.blob.core.windows.net/learnomicstorage/BIOLOGY.jpeg?sp=r&st=2025-04-08T06:48:34Z&se=2026-04-01T14:48:34Z&spr=https&sv=2024-11-04&sr=b&sig=dG8tvUsPZ0fsDPiCSbU%2FpRPJ4C9vDgtfC5uDIhWIHJc%3D"
const physicsImage = "https://learnomicstorage.blob.core.windows.net/learnomicstorage/PHYSICS.jpg?sp=r&st=2025-04-08T06:49:03Z&se=2026-04-01T14:49:03Z&spr=https&sv=2024-11-04&sr=b&sig=tmbrIL0DI6vOTVko8%2FFZwAx8CZPDIaRXq1ApdOtvmSc%3D"
const chemistryImage = "https://learnomicstorage.blob.core.windows.net/learnomicstorage/CHEMSTRY.jpg?sp=r&st=2025-04-08T06:49:36Z&se=2026-04-01T14:49:36Z&spr=https&sv=2024-11-04&sr=b&sig=P8YRiu89ae4Xmmbe1zMR7jz8GslQHfyoHJCSS%2FunYF8%3D"
const defaultImage = "https://learnomicstorage.blob.core.windows.net/learnomicstorage/education.jpg?sp=r&st=2025-04-08T06:50:07Z&se=2026-04-01T14:50:07Z&spr=https&sv=2024-11-04&sr=b&sig=mVRelojD%2BxsGp%2FFdXtTbhhVsuLXMmHhCMFrffRBy5Ro%3D"

// Map subject names to their corresponding images
const getSubjectImage = (subjectName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Mathematics': mathImage,
    'MATHEMATICS': mathImage,
    'MATH': mathImage,
    'Math': mathImage,
    'Biology': biologyImage,
    'BIOLOGY': biologyImage,
    'BOTANY': biologyImage,
    'ZOOLOGY': biologyImage,
    'Physics': physicsImage,
    'PHYSICS': physicsImage,
    'Chemistry': chemistryImage,
    'CHEMISTRY': chemistryImage,
  };
  return imageMap[subjectName] || defaultImage;
};

// Helper function to format subject name for URL
const formatSubjectForUrl = (subject: string): string => {
  if (subject.toLowerCase() === 'mathematics') {
    return 'Mathematics';
  }
  return subject.toUpperCase().replace(/\s+/g, '%20');
};

// Interface for the API response
interface Subject {
  _id: string;
  subject: string;
}

interface SubjectCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  id,
  name, 
  description
}) => {
  const navigate = useNavigate();

  // Get the local image based on subject name
  const subjectImage = getSubjectImage(name);

  const handleSubjectClick = () => {
    // Format the subject name and navigate to the playlists page
    const formattedSubject = formatSubjectForUrl(name);
    navigate('/showPlaylist', { 
      state: { 
        subject: formattedSubject,
        subjectId: id,
        subjectName: name
      } 
    });
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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        // Updated API call to match new endpoint format
        const response = await apiClient.get(`${API_ENDPOINTS.GetAllSubjects}`);
        console.log('API Response:', response.data);
        
        // Set the subjects directly from the response data array
        setSubjects(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

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
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-22 pt-6 pb-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Subjects</h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
          Explore our comprehensive collection of subjects and start learning today
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject, index) => (
          <SubjectCard
            key={`${subject.subject}-${index}`}
            id={subject._id}
            name={subject.subject}
            description={`CBSE - Grade 10`} // Static description since board and grade are now in query params
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectCard;
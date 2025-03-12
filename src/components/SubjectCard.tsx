import React from 'react';
import { Link } from 'react-router-dom';

export const subjects = [
  {
    id: 1,
    name: 'Mathematics',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    description: 'Explore the world of numbers, algebra, geometry, and calculus with our comprehensive mathematics courses.',
  },
  {
    id: 2,
    name: 'Computer Science',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    description: 'Learn programming, algorithms, data structures, and software engineering principles.',
  },
  {
    id: 3,
    name: 'Physics',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    description: 'Discover the fundamental laws that govern the universe, from classical mechanics to quantum physics.',
  },
  {
    id: 4,
    name: 'Biology',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    description: 'Study living organisms, their structure, function, growth, and evolution.',
  },
  {
    id: 5,
    name: 'Chemistry',
    imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    description: 'Explore the composition, structure, properties, and change of matter.',
  },
  {
    id: 6,
    name: 'History',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    description: 'Journey through time and learn about significant events, civilizations, and figures that shaped our world.',
  },
  {
    id: 7,
    name: 'Literature',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Explore great works of literature, poetry, and creative writing from around the world.',
  },
  {
    id: 8,
    name: 'Geography',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: "Study the Earth's landscapes, environments, populations, and cultures.",
  },
  {
    id: 9,
    name: 'Art History',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Discover the history of visual arts, from ancient times to contemporary movements.',
  }
];

interface SubjectCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  description?: string;
  linkTo?: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  id, 
  name, 
  imageUrl, 
  description, 
  linkTo = `/subjects/${id}` 
}) => {
  const cardContent = (
    <div className="group  h-full flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
      <div className="flex-shrink-0 relative h-48 overflow-hidden">
        <img 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          src={imageUrl} 
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

  return linkTo ? (
    <Link to={linkTo} className="h-full">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export const SubjectsPage: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Subjects</h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
          Explore our comprehensive collection of subjects and start learning today
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
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

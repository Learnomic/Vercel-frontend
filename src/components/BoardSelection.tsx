import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const boards = [
  {
    id: 'cbse',
    name: 'CBSE',
    description: 'Central Board of Secondary Education',
    logo: '🏛️',
  },
  {
    id: 'icse',
    name: 'ICSE',
    description: 'Indian Certificate of Secondary Education',
    logo: '🎓',
  },
  {
    id: 'state',
    name: 'State Board',
    description: 'State Board of Education',
    logo: '🏫',
  },

];

const grades = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Grade ${i + 1}`,
  value: i + 1
}));

const BoardSelection: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoard(boardId);
  };

  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrade(gradeId);
  };

  const handleNext = () => {
    if (currentStep < totalSteps && selectedBoard) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {currentStep === 1 ? 'Select Board' : 'Select Grade'}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {currentStep === 1 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Select Your Board</h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose your education board to get personalized learning content
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => handleBoardSelect(board.id)}
                className={`p-6 rounded-lg shadow-md transition-all duration-300 text-left ${
                  selectedBoard === board.id
                    ? 'bg-indigo-50 border-2 border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50'
                    : 'bg-white hover:shadow-lg border-2 border-transparent'
                }`}
              >
                <div className="text-4xl mb-4">{board.logo}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{board.name}</h3>
                <p className="text-gray-600">{board.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Select Your Grade</h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose your current grade level
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.id)}
                className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
                  selectedGrade === grade.id
                    ? 'bg-indigo-50 border-2 border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50'
                    : 'bg-white hover:shadow-lg border-2 border-transparent'
                }`}
              >
                <h3 className="text-lg font-semibold text-center text-gray-900">
                  {grade.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className={`px-6 py-3 rounded-md font-medium ${
            currentStep === 1
              ? 'invisible'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Back
        </button>
        
        {currentStep === totalSteps && selectedGrade ? (
          <Link
            to={`/subjects?board=${selectedBoard}&grade=${selectedGrade}`}
            className="btn-gradient px-6 py-3 font-medium"
          >
            View Subjects
          </Link>
        ) : (
          <button
            onClick={handleNext}
            disabled={!selectedBoard}
            className={selectedBoard
              ? "btn-gradient px-6 py-3 font-medium"
              : "px-6 py-3 rounded-md font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardSelection; 
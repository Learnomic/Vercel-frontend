import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUniversity, FaGraduationCap, FaSchool } from 'react-icons/fa';
import { authService } from '../services/apiServices';

const boards = [
  {
    id: 'CBSE',
    name: 'CBSE',
    description: 'Central Board of Secondary Education',
    logo: <FaUniversity className="text-indigo-600" />,
  },
  {
    id: 'ICSE',
    name: 'ICSE',
    description: 'Indian Certificate of Secondary Education',
    logo: <FaGraduationCap className="text-indigo-600" />,
  },
  {
    id: 'SSC',
    name: 'State Board',
    description: 'State Board of Education',
    logo: <FaSchool className="text-indigo-600" />,
  },

];

const numberToTextMap = {
  1: 'ONE',
  2: 'TWO',
  3: 'THREE',
  4: 'FOUR',
  5: 'FIVE',
  6: 'SIX',
  7: 'SEVEN',
  8: 'EIGHT',
  9: 'NINE',
  10: 'TEN',
  11: 'ELEVEN',
  12: 'TWELVE'
};

const grades = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Grade ${i + 1}`,
  value: numberToTextMap[i + 1 as keyof typeof numberToTextMap]
}));

const BoardSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    // Check if we have registration data
    const registrationData = localStorage.getItem('registrationData');
    if (!registrationData) {
      // If no registration data, redirect back to signup
      navigate('/signup');
    }
  }, [navigate]);

  // Validate school info form
  useEffect(() => {
    setFormValid(
      schoolName.trim() !== "" && 
      division.trim() !== "" && 
      pincode.trim() !== "" && 
      /^\d{6}$/.test(pincode) // Validate pincode format (6 digits)
    );
  }, [schoolName, division, pincode]);

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoard(boardId);
  };

  const handleGradeSelect = (gradeId: number) => {
    const textGrade = numberToTextMap[gradeId as keyof typeof numberToTextMap];
    setSelectedGrade(textGrade);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && !formValid) {
        return;
      }
      if (currentStep === 2 && !selectedBoard) {
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!schoolName || !division || !pincode || !selectedBoard || !selectedGrade) return;

    const registrationData = localStorage.getItem('registrationData');
    if (!registrationData) {
      navigate('/signup');
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const basicData = JSON.parse(registrationData);
      const completeData = {
        ...basicData,
        school_name: schoolName,
        division: division,
        pincode: pincode,
        board: selectedBoard,
        grade: selectedGrade
      };

      await authService.register(completeData);
      
      // Clear registration data
      localStorage.removeItem('registrationData');
      
      // Show success message and redirect to login
      alert("Registration successful! Please log in.");
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'School Information';
      case 2: return 'Select Board';
      case 3: return 'Select Grade';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs sm:text-sm font-medium text-indigo-600">
            {getStepTitle()}
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
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">School Information</h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
              Please provide details about your school
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  id="school_name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your school name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                  Division
                </label>
                <input
                  type="text"
                  id="division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your division (e.g., A, B, C)"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  pattern="\d{6}"
                  required
                />
                {pincode && !/^\d{6}$/.test(pincode) && (
                  <p className="mt-1 text-sm text-red-600">Please enter a valid 6-digit pincode</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : currentStep === 2 ? (
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Select Your Board</h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
              Choose your education board to get personalized learning content
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => handleBoardSelect(board.id)}
                className={`p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 text-left ${
                  selectedBoard === board.id
                    ? 'bg-indigo-50 border-2 border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50'
                    : 'bg-white hover:shadow-lg border-2 border-transparent'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{board.logo}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">{board.name}</h3>
                <p className="text-sm sm:text-base text-gray-600">{board.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Select Your Grade</h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
              Choose your current grade level
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.id)}
                className={`p-3 sm:p-4 rounded-lg shadow-md transition-all duration-300 ${
                  selectedGrade === grade.value
                    ? 'bg-indigo-50 border-2 border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50'
                    : 'bg-white hover:shadow-lg border-2 border-transparent'
                }`}
              >
                <h3 className="text-base sm:text-lg font-semibold text-center text-gray-900">
                  {grade.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
        <button
          onClick={handleBack}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium ${
            currentStep === 1
              ? 'invisible'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Back
        </button>
        
        {currentStep === totalSteps && selectedGrade ? (
          <button
            onClick={handleCompleteRegistration}
            disabled={isLoading}
            className="btn-gradient px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium text-center sm:text-left"
          >
            {isLoading ? "Registering..." : "Complete Registration"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={(currentStep === 1 && !formValid) || (currentStep === 2 && !selectedBoard)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium ${
              (currentStep === 1 && formValid) || (currentStep === 2 && selectedBoard) || (currentStep === 3)
                ? 'btn-gradient'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardSelection;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../services/apiServices';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface QuizProps {
  videoUrl: string;
  curriculumData?: {
    _id: string;
    chapters: Array<{
      _id: string;
      chapterName?: string;
      topics: Array<{
        _id: string;
        topicName: string;
        subtopics: Array<{
          _id: string;
          subtopicName: string;
          videos: Array<{
            _id: string;
            videoUrl: string;
          }>;
        }>;
      }>;
    }>;
  };
}

interface QuizQuestion {
  que: string;
  opt: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface SubjectInfo {
  _id: string;
  name: string;
  chapterName: string;
  topicName: string;
  subtopicName: string;
  topicId: string;
}

interface QuizData {
  _id: string;
  questions: QuizQuestion[];
  videoId: string;
  videoUrl: string;
  subject: SubjectInfo;
  totalQuestions: number;
  selectedQuestionsCount: number;
}

interface QuizSubmission {
  quizId: string;
  videoId: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  chapterName: string;
  subtopicName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  answers: Array<{
    questionIndex: number;
    selectedOption: string;
    isCorrect: boolean;
  }>;
}

interface QuizState {
  quizData: QuizData | null;
  currentQuestionIndex: number;
  selectedAnswers: { [key: number]: string };
  showResults: boolean;
  score: { correct: number; total: number } | null;
  startTime: Date;
  quizSubmission: QuizSubmission | null;
  isSaved: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

// Custom hook for authentication state
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return !!token;
  }, []);

  useEffect(() => {
    const updateLoginStatus = () => {
      const currentStatus = checkLoginStatus();
      setIsLoggedIn(currentStatus);
    };

    // Initial check
    updateLoginStatus();

    // Set up event listeners
    const handleAuthEvent = () => updateLoginStatus();
    window.addEventListener('login', handleAuthEvent);
    window.addEventListener('logout', handleAuthEvent);

    // Periodic check (reduced frequency)
    const intervalId = setInterval(updateLoginStatus, 5000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('login', handleAuthEvent);
      window.removeEventListener('logout', handleAuthEvent);
    };
  }, [checkLoginStatus]);

  return { isLoggedIn, checkLoginStatus };
};

// Custom hook for quiz data fetching
const useQuizData = (videoId: string | null) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizData = async () => {
    if (!videoId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching quiz for video ID:', videoId);
      console.log('Full quiz URL:', `${API_ENDPOINTS.GetQuiz}videoUrl=${videoId}`);
      const response = await apiClient.get(`${API_ENDPOINTS.GetQuiz}videoUrl=${videoId}`);
      
      if (response.data.success && response.data.data) {
        setQuizData(response.data.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.error('Error fetching quiz:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [videoId]);

  return { quizData, isLoading, error, refetch: () => videoId && fetchQuizData() };
};

const Quiz: React.FC<QuizProps> = ({ videoUrl, curriculumData }) => {
  const { isLoggedIn } = useAuth();
  const videoId = useMemo(() => videoUrl, [videoUrl]);
  const { quizData, isLoading: isLoadingQuiz, error: quizError } = useQuizData(videoId);

  const [state, setState] = useState<Omit<QuizState, 'quizData' | 'isLoggedIn' | 'isLoading'>>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
    score: null,
    startTime: new Date(),
    quizSubmission: null,
    isSaved: false,
    error: null,
    isSaving: false,
  });

  // Reset state when quiz data changes
  useEffect(() => {
    if (quizData) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        showResults: false,
        score: null,
        startTime: new Date(),
        quizSubmission: null,
        isSaved: false,
        error: null,
      }));
    }
  }, [quizData]);

  // Handle logout events
  useEffect(() => {
    const handleLogout = () => {
      console.log("Logout detected in Quiz component");
      setState(prev => ({
        ...prev,
        isSaved: false,
        quizSubmission: null,
      }));
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  // Find topic ID from curriculum data
  const findTopicId = useCallback((videoId: string): string => {
    if (!curriculumData?.chapters) return '';

    for (const chapter of curriculumData.chapters) {
      for (const topic of chapter.topics || []) {
        for (const subtopic of topic.subtopics || []) {
          for (const video of subtopic.videos || []) {
            if (video._id === videoId) {
              return topic._id;
            }
          }
        }
      }
    }
    return '';
  }, [curriculumData]);

  // Submit quiz results
  const submitQuizResults = useCallback(async (quizResults: QuizSubmission) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Submitting quiz results:', quizResults);
      
      const response = await apiClient.post(
        API_ENDPOINTS.SubmitQuiz,
        quizResults
      );
      
      console.log('Quiz results submitted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error submitting quiz results:', error);
      if (error.response) {
        console.error('Error details:', {
          data: error.response.data,
          status: error.response.status,
        });
      }
      throw error;
    }
  }, []);

  // Handle option selection
  const handleOptionSelect = useCallback((option: string) => {
    setState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [prev.currentQuestionIndex]: option
      }
    }));
  }, []);

  // Calculate final results and create submission
  const calculateResults = useCallback(() => {
    if (!quizData) return null;

    const correctAnswers = Object.entries(state.selectedAnswers).reduce(
      (count, [index, answer]) => {
        return answer === quizData.questions[parseInt(index)].correctAnswer ? count + 1 : count;
      },
      0
    );

    const totalQuestions = quizData.questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = Math.floor((new Date().getTime() - state.startTime.getTime()) / 1000);

    const answers = Object.entries(state.selectedAnswers).map(([index, selectedOption]) => ({
      questionIndex: parseInt(index),
      selectedOption,
      isCorrect: selectedOption === quizData.questions[parseInt(index)].correctAnswer
    }));

    const topicId = findTopicId(quizData.videoId);

    const submission: QuizSubmission = {
      quizId: quizData._id,
      videoId: quizData.videoId,
      subjectId: curriculumData?._id || quizData.subject._id || '',
      subjectName: quizData.subject.name,
      topicId: topicId || quizData.subject.topicId || '',
      topicName: quizData.subject.topicName,
      chapterName: quizData.subject.chapterName,
      subtopicName: quizData.subject.subtopicName,
      totalQuestions,
      correctAnswers,
      score: scorePercentage,
      timeSpent,
      answers
    };

    return {
      score: { correct: correctAnswers, total: totalQuestions },
      submission
    };
  }, [quizData, state.selectedAnswers, state.startTime, findTopicId, curriculumData]);

  // Handle next/submit button
  const handleNext = useCallback(async () => {
    if (!quizData) return;

    if (state.currentQuestionIndex === quizData.questions.length - 1) {
      // Calculate results and submit
      const results = calculateResults();
      if (!results) return;

      setState(prev => ({
        ...prev,
        score: results.score,
        quizSubmission: results.submission,
        showResults: true,
      }));

      // Auto-save if logged in
      if (isLoggedIn) {
        setState(prev => ({ ...prev, isSaving: true }));
        try {
          await submitQuizResults(results.submission);
          setState(prev => ({ ...prev, isSaved: true }));
        } catch (error) {
          console.error("Failed to auto-save quiz:", error);
          setState(prev => ({ 
            ...prev, 
            error: "Failed to save quiz results automatically" 
          }));
        } finally {
          setState(prev => ({ ...prev, isSaving: false }));
        }
      }
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  }, [quizData, state.currentQuestionIndex, calculateResults, isLoggedIn, submitQuizResults]);

  // Handle save quiz button
  const handleSaveQuiz = useCallback(async () => {
    if (!state.quizSubmission || !quizData) return;

    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token) {
      setState(prev => ({ ...prev, isSaving: true, error: null }));
      
      try {
        await submitQuizResults(state.quizSubmission);
        setState(prev => ({ ...prev, isSaved: true }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: "Failed to save quiz results. Please try again." 
        }));
      } finally {
        setState(prev => ({ ...prev, isSaving: false }));
      }
    } else {
      // Store for later and redirect to signup
      sessionStorage.setItem('pendingQuizSubmission', JSON.stringify(state.quizSubmission));
      sessionStorage.setItem('quizVideoId', quizData.videoId);
      window.location.href = `/signup?redirectFrom=quiz&videoId=${quizData.videoId}`;
    }
  }, [state.quizSubmission, quizData, submitQuizResults]);

  // Loading state
  if (isLoadingQuiz) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <FaSpinner className="animate-spin text-indigo-600 text-2xl mr-2" />
        <span>Loading quiz...</span>
      </div>
    );
  }

  // Error state
  if (quizError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error loading quiz: {quizError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-600">No quiz data available</p>
      </div>
    );
  }

  // Results view
  if (state.showResults) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score Display */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Results</h2>
            
            {/* Subject Information */}
            <div className="mb-4 text-center">
              <p className="text-lg text-gray-600">Subject: {quizData.subject.name}</p>
              <p className="text-sm text-gray-500">Chapter: {quizData.subject.chapterName}</p>
              <p className="text-sm text-gray-500">Topic: {quizData.subject.topicName}</p>
              <p className="text-sm text-gray-500">Subtopic: {quizData.subject.subtopicName}</p>
            </div>
            
            <p className="text-xl">
              Score: <span className="font-bold text-indigo-600">{state.score?.correct}</span> / {state.score?.total}
              {' '}({Math.round((state.score?.correct || 0) / (state.score?.total || 1) * 100)}%)
            </p>
            
            {/* Error Message */}
            {state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
                {state.error}
              </div>
            )}
            
            {/* Save Quiz Button */}
            {!isLoggedIn && !state.isSaved && (
              <div className="mt-6">
                <button
                  onClick={handleSaveQuiz}
                  disabled={state.isSaving}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                           transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 
                           disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {state.isSaving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Quiz Results'
                  )}
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  Sign up to save your quiz results and track your progress!
                </p>
              </div>
            )}
            
            {/* Saved Message */}
            {state.isSaved && (
              <div className="mt-6 text-green-600 flex items-center justify-center">
                <FaCheckCircle className="mr-2" />
                <span>Quiz results saved successfully!</span>
              </div>
            )}
          </div>

          {/* Questions Review */}
          {quizData.questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {index + 1}. {question.que}
              </h3>
              
              <div className="space-y-3">
                {Object.entries(question.opt).map(([key, value]) => {
                  const isCorrect = key === question.correctAnswer;
                  const isSelected = state.selectedAnswers[index] === key;
                  const isWrong = isSelected && !isCorrect;
                  
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg ${
                        isCorrect
                          ? 'bg-green-100 border border-green-500'
                          : isWrong
                          ? 'bg-red-100 border border-red-500'
                          : 'border border-gray-200'
                      }`}
                    >
                      <span className={`${
                        isCorrect ? 'font-medium text-green-800' : 
                        isWrong ? 'text-red-800' : 'text-gray-700'
                      }`}>
                        {key}. {value}
                        {isCorrect && ' ✓'}
                        {isWrong && ' ✗'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Explanation:</span> {question.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz taking view
  const currentQuestion = quizData.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const hasSelectedAnswer = state.selectedAnswers[state.currentQuestionIndex] !== undefined;

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {state.currentQuestionIndex + 1} of {quizData.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          {/* Subject Information */}
          <div className="text-center mb-2">
            <span className="text-sm font-medium text-indigo-600">{quizData.subject.name}</span>
            <span className="text-xs text-gray-500 block">{quizData.subject.topicName}</span>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {currentQuestion.que}
          </h2>
          
          <div className="space-y-3">
            {Object.entries(currentQuestion.opt).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)}
                className={`w-full p-4 text-left rounded-lg transition-all ${
                  state.selectedAnswers[state.currentQuestionIndex] === key
                    ? 'bg-indigo-50 border-2 border-indigo-500'
                    : 'border border-gray-200 hover:border-indigo-500 hover:bg-gray-50'
                }`}
              >
                {key}. {value}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!hasSelectedAnswer}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                       transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {state.currentQuestionIndex === quizData.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
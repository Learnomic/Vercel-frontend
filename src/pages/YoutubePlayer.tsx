import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaRegCircle, FaCheckCircle, FaClock, FaArrowLeft, FaList, FaTimes } from 'react-icons/fa';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../services/apiServices';
import axios from 'axios';
import VideoProgressDisplay from '../components/VideoProgressDisplay';


// Define interfaces
interface Playlist {
  board: string;
  grade: string;
  playlist_id: string;
  subject: string;
  thumbnail: string;
  title: string;
  video_count: number;
}

interface Video {
  video_id: string;
  title: string;
  thumbnail: string;
  duration: string; // This field is now provided by the API
  description?: string;
  position: number;
  progress?: number;
}

interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
  explanation: string;
}

interface QuizData {
  questions: Question[];
  error?: string;
}

const YoutubePlayer: React.FC = () => {
  // State variables
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [totalDuration, setTotalDuration] = useState<string>("0:00");
  const [showSidebar, setShowSidebar] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const subjectFromState = location.state?.subject;

  // Fetch playlists when component mounts
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userStr);
        const { board, grade } = user;

        // Fetch playlists based on user's board and grade
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
      
        const response = await apiClient.get(API_ENDPOINTS.GetPlaylist, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            board,
            grade
          }
        });

        if (Array.isArray(response.data.playlists)) {
          // Filter playlists by subject if available
          let filteredPlaylists = response.data.playlists;
          
          if (subjectFromState) {
            filteredPlaylists = response.data.playlists.filter(
              (playlist: Playlist) => playlist.subject === subjectFromState
            );
          }
          
          setPlaylists(filteredPlaylists);
          
          // Select the first playlist by default if available
          if (filteredPlaylists.length > 0) {
            setSelectedPlaylist(filteredPlaylists[0]);
            // Fetch videos for the first playlist
            fetchVideos(filteredPlaylists[0].playlist_id);
          }
        } else {
          setError('Invalid playlist data received');
        }
      } catch (err: any) {
        console.error('Error fetching playlists:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load playlists. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [navigate, subjectFromState]);

  // Fetch videos for a playlist
  const fetchVideos = async (playlistId: string) => {
    try {
      setLoadingVideos(true);
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await apiClient.get(API_ENDPOINTS.GetVideo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          playlist_id: playlistId
        }
      });

      if (Array.isArray(response.data.videos)) {
        // Add default description if not provided
        const videosWithDescription = response.data.videos.map((video: Video) => ({
          ...video,
          description: video.description || 'No description available'
        }));
        
        console.log("videos", videosWithDescription);
        
        setVideos(videosWithDescription);
        
        // Calculate total duration
        const totalSeconds = videosWithDescription.reduce((total, video) => {
          return total + convertDurationToSeconds(video.duration || "0:00");
        }, 0);
        
        setTotalDuration(formatTotalDuration(totalSeconds));
        
        // Select the first video by default
        if (videosWithDescription.length > 0) {
          setSelectedVideo(videosWithDescription[0]);
        } else {
          setSelectedVideo(null);
        }
      } else {
        setError('Invalid video data received');
      }
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoadingVideos(false);
      setLoading(false);
    }
  };

  // Helper function to convert duration string to seconds
  const convertDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  };

  // Helper function to format total duration
  const formatTotalDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Handle playlist selection
  const handlePlaylistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const playlistId = e.target.value;
    const playlist = playlists.find(p => p.playlist_id === playlistId);
    if (playlist) {
      setSelectedPlaylist(playlist);
      fetchVideos(playlistId);
    }
  };

  // Handle video selection
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    // Reset all quiz related states when changing video
    setQuizData(null);
    setSelectedAnswers({});
    setShowAnswers(false);
    setScore(null);
    // Close sidebar on mobile after selecting a video
    setShowSidebar(false);
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Generate quiz for the current video
  const handleGenerateQuiz = async () => {
    if (!selectedVideo) return;
    
    setGeneratingQuiz(true);
    // Reset all quiz related states when generating new quiz
    setQuizData(null);
    setSelectedAnswers({});
    setShowAnswers(false);
    setScore(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await apiClient.post(API_ENDPOINTS.GenerateQuiz, {
        video_id: selectedVideo.video_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("quiz data",response.data);
      
      setQuizData(response.data);
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      setQuizData({
        error: err.response?.data?.error || 'Failed to generate quiz. Please try again.',
        questions: []
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleShowAnswers = () => {
    // Calculate score
    const correctAnswers = quizData?.questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.answer ? count + 1 : count;
    }, 0) || 0;
    
    const totalQuestions = quizData?.questions.length || 0;
    setScore({ correct: correctAnswers, total: totalQuestions });
    setShowAnswers(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
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

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-600 mb-4">
          No playlists found {subjectFromState ? `for ${subjectFromState}` : ''}
        </div>
        <button
          onClick={() => navigate('/subjects')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Top navigation bar for mobile */}
      <div className="bg-white p-4 shadow-md flex justify-between items-center md:hidden">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/subjects')}
            className="text-gray-700 hover:text-indigo-600"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-bold text-gray-800 truncate max-w-[200px]">
            {subjectFromState ? `${subjectFromState}` : 'Videos'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
            <FaClock className="mr-1 text-indigo-600" />
            <span>{totalDuration}</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-indigo-600 p-1"
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* Playlist selector for mobile */}
      <div className="bg-white px-4 py-2 md:hidden">
        {/* <select 
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={selectedPlaylist?.playlist_id || ''}
          onChange={handlePlaylistChange}
        >
          {playlists.map(playlist => (
            <option key={playlist.playlist_id} value={playlist.playlist_id}>
              {playlist.title}
            </option>
          ))}
        </select> */}
      </div>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Left sidebar - Video list (fixed for mobile, normal for desktop) */}
      <div 
        className={`fixed md:static inset-y-0 right-0 w-4/5 md:w-1/3 lg:w-1/4 bg-white shadow-md overflow-y-auto z-50 transition-transform duration-300 transform ${
          showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } md:shadow-none md:z-0 md:block`}
        style={{ top: '0', height: '100%' }}
      >
        {/* Mobile sidebar header with close button */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center md:hidden">
          <h2 className="text-lg font-semibold">Video List</h2>
          <button 
            onClick={() => setShowSidebar(false)}
            className="text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Desktop sidebar header */}
        <div className="p-4 border-b border-gray-200 hidden md:block">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {subjectFromState ? `${subjectFromState} Videos` : 'Videos'}
            </h2>
            <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <FaClock className="mr-1 text-indigo-600" />
              <span>{totalDuration}</span>
            </div>
          </div>
          
        </div>
        
        {/* Video list */}
        {loadingVideos ? (
          <div className="flex items-center justify-center h-48">
            <FaSpinner className="animate-spin text-2xl text-indigo-600" />         
          </div>
        ) : videos.length > 0 ? (
          <ul className="pb-20 md:pb-0">
            {/* {videos.map((video) => (
              <li 
                key={video.video_id} 
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedVideo?.video_id === video.video_id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="font-medium text-gray-800 text-sm md:text-base">{video.title}</div>
                </div>
              </li>
            ))} */}
            
{videos.map((video) => (
  <li 
    key={video.video_id} 
    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
      selectedVideo?.video_id === video.video_id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
    }`}
    onClick={() => handleVideoClick(video)}
  >
    <div className="flex items-center space-x-3">
      <div className="relative flex-shrink-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-20 h-12 object-cover rounded"
        />
        {/* Duration badge */}
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center">
          <p className="font-medium text-gray-800 text-sm md:text-base truncate">
            {video.title}
          </p>
          <VideoProgressDisplay video_id={video.video_id} progress={Math.floor(Math.random() * 100)} />
        </div>
      </div>
    </div>
  </li>
))}
          </ul>
        ) : (
          <div className="text-center p-4 text-gray-500">
            No videos found in this playlist
          </div>
        )}
      </div>

      {/* Right content area - Video player and quiz */}
      <div className="scrollbar-hide w-full md:w-2/3 lg:w-3/4 overflow-y-auto h-[calc(100vh-112px)] md:h-screen pt-2 px-2 md:p-4">
        {selectedVideo ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            {/* Video player - responsive aspect ratio */}
            <div className="relative pt-0 pb-0 h-0" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                className="absolute top-[10%] left-[10%] w-[75%] h-[75%]"
                src={`https://www.youtube.com/embed/${selectedVideo.video_id}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Video information */}
            <div className="p-3 md:p-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-medium text-gray-800 truncate">{selectedVideo.title}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <FaClock className="mr-1" />
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          
            {/* Generate Quiz Button */}
            <div className="p-3 md:p-4 flex justify-center border-t border-gray-100">
              <button
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz}
                className="px-4 md:px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 text-sm md:text-base"
              >
                {generatingQuiz ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Generating Quiz...
                  </span>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md mb-4">
            <p className="text-gray-500">Select a video to start playing</p>
          </div>
        )}

        {/* Quiz Display */}
        {quizData && (
          <div className="bg-white rounded-lg shadow-md p-3 md:p-6 mt-4 mb-6">
            <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">Quiz</h2>
              {showAnswers && score && (
                <div className="flex items-center space-x-2">
                  <span className="text-base md:text-lg font-semibold text-gray-700">Score:</span>
                  <span className="px-3 py-1 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-lg text-sm md:text-base">
                    {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                  </span>
                </div>
              )}
            </div>
            
            {quizData.error ? (
              <div className="text-red-600">{quizData.error}</div>
            ) : (
              <>
                <div className="space-y-6 md:space-y-8">
                  {quizData.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="bg-gray-50 rounded-xl p-3 md:p-6">
                      <p className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">
                        {questionIndex + 1}. {question.question}
                      </p>
                      <div className="space-y-2 md:space-y-3">
                        {Object.entries(question.options).map(([key, value]) => (
                          <label
                            key={key}
                            onClick={() => handleOptionSelect(questionIndex, key)}
                            className={`flex items-center space-x-3 p-2 md:p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm md:text-base ${
                              selectedAnswers[questionIndex] === key
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-100'
                            } ${
                              showAnswers
                                ? key === question.answer
                                  ? 'bg-green-50 border border-green-200'
                                  : selectedAnswers[questionIndex] === key
                                  ? 'bg-red-50 border border-red-200'
                                  : ''
                                : ''
                            }`}
                          >
                            <div className="flex items-center">
                              {showAnswers ? (
                                key === question.answer ? (
                                  <FaCheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                                ) : selectedAnswers[questionIndex] === key ? (
                                  <FaRegCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                                ) : (
                                  <FaRegCircle className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                                )
                              ) : (
                                <div
                                  className={`h-4 w-4 md:h-5 md:w-5 rounded-full border-2 ${
                                    selectedAnswers[questionIndex] === key
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-300'
                                  } flex items-center justify-center`}
                                >
                                  {selectedAnswers[questionIndex] === key && (
                                    <div className="h-1 w-1 md:h-2 md:w-2 rounded-full bg-white" />
                                  )}
                                </div>
                              )}
                            </div>
                            <span className={`flex-grow text-gray-700 ${
                              showAnswers && key === question.answer ? 'font-medium' : ''
                            }`}>
                              {key}. {value}
                            </span>
                          </label>
                        ))}
                      </div>
                      {showAnswers && (
                        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 rounded-lg">
                          <p className="text-xs md:text-sm text-blue-800">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {!showAnswers && Object.keys(selectedAnswers).length > 0 && (
                  <div className="mt-6 md:mt-8 flex justify-center">
                    <button
                      onClick={handleShowAnswers}
                      className="px-5 py-2 md:px-6 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base"
                    >
                      Check Answers
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default YoutubePlayer;
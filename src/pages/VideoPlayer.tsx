import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FaSpinner, 
  FaPlay, 
  FaCheckCircle, 
  FaBars, 
  // FaTimes, 
  // FaList,
  FaVideo,
  FaBook,
  FaChevronRight
} from 'react-icons/fa';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../services/apiServices';
import Quiz from './Quiz';
import LoginWarningModal from '../components/LoginWarningModal'; // Import the separate component

// Updated interfaces to match the actual API response
interface Video {
  _id: string;
  videoUrl: string;
}

interface Subtopic {
  _id: string;
  subtopicName: string;
  videos: Video[];
}

interface Topic {
  _id: string;
  topicName: string;
  subtopics: Subtopic[];
}

interface Chapter {
  _id: string;
  chapterName?: string;
  topics: Topic[];
}

interface CurriculumResponse {
  success: boolean;
  data: {
    _id: string;
    chapters: Chapter[];
  };
}

// Flattened video structure for easier navigation
interface FlattenedVideo {
  id: string;
  title: string;
  videoUrl: string;
  chapterName: string;
  topicName: string;
  subtopicName: string;
  chapterIndex: number;
  videoIndex: number;
}

const VideoPlayer: React.FC = () => {
  const [curriculumData, setCurriculumData] = useState<CurriculumResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [currentVideoInfo, setCurrentVideoInfo] = useState<FlattenedVideo | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(true); // Default to true for desktop
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSavedSuccess, setQuizSavedSuccess] = useState(false);
  const [flattenedVideos, setFlattenedVideos] = useState<FlattenedVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Login warning modal states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  
  const quizRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  
  // Check both location state and URL parameters
  const urlParams = new URLSearchParams(location.search);
  
  const quizSavedState = location.state?.quizSaved;
  const quizSavedQuery = urlParams.get('quizSaved') === 'true';
  const quizSaved = quizSavedState || quizSavedQuery;
  
  const redirectVideoIdState = location.state?.videoId;
  const redirectVideoIdQuery = urlParams.get('videoId');
  const redirectVideoId = redirectVideoIdState || redirectVideoIdQuery;
  
  const subjectName = location.state?.subjectName || location.state?.subject || "Science";

  // Helper function to extract YouTube ID from various URL formats
  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /youtu\.be\/([^?&]+)/,
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtube\.com\/embed\/([^?&]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1].split('?')[0];
      }
    }
    return null;
  };

  // Flatten curriculum data for easier video navigation
  const flattenCurriculumData = (data: CurriculumResponse['data']): FlattenedVideo[] => {
    const flattened: FlattenedVideo[] = [];
    let videoIndex = 0;

    data.chapters.forEach((chapter, chapterIndex) => {
      chapter.topics?.forEach(topic => {
        topic.subtopics?.forEach(subtopic => {
          subtopic.videos?.forEach(video => {
            flattened.push({
              id: video._id,
              title: subtopic.subtopicName,
              videoUrl: video.videoUrl,
              chapterName: chapter.chapterName || `Chapter ${chapterIndex + 1}`,
              topicName: topic.topicName,
              subtopicName: subtopic.subtopicName,
              chapterIndex,
              videoIndex: videoIndex++
            });
          });
        });
      });
    });

    return flattened;
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Handle responsive playlist visibility
  // Display success message when quiz is saved after signup
  useEffect(() => {
    const handleResize = () => {
      // Auto-hide playlist on mobile, show on desktop
      if (window.innerWidth < 1024) {
        setShowPlaylist(false);
      } else {
        setShowPlaylist(true);
      }
    };

    // Set initial state
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (quizSaved) {
      setQuizSavedSuccess(true);
      const timer = setTimeout(() => {
        setQuizSavedSuccess(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [quizSaved]);

  // Handle video selection when redirected with videoId
  useEffect(() => {
    if (redirectVideoId && flattenedVideos.length > 0) {
      const targetVideo = flattenedVideos.find(video => video.id === redirectVideoId);
      if (targetVideo) {
        handleVideoSelect(targetVideo);
      }
    }
  }, [redirectVideoId, flattenedVideos]);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        if (!subjectName) {
          setError('Subject name is required to load curriculum');
          return;
        }

        const response = await apiClient.get(
          `${API_ENDPOINTS.GetCurriculum}${subjectName}`
        );
        
        const responseData = response.data.success ? response.data.data : response.data;
        setCurriculumData(responseData);

        // Flatten the data for easier navigation
        const flattened = flattenCurriculumData(responseData);
        setFlattenedVideos(flattened);

        // Auto-select first video if no redirect video
        if (!redirectVideoId && flattened.length > 0) {
          handleVideoSelect(flattened[0]);
        }

      } catch (err: any) {
        console.error('Error fetching curriculum:', err);
        setError(err.response?.data?.message || 'Failed to load curriculum');
      } finally {
        setLoading(false);
      }
    };

    if (subjectName) {
      setLoading(true);
      fetchCurriculum();
    } else {
      setLoading(false);
      setError('Subject name is required to load curriculum');
    }
  }, [subjectName]);

  const handleVideoSelect = (video: FlattenedVideo) => {
    const youtubeId = extractYoutubeId(video.videoUrl);
    if (youtubeId) {
      setSelectedVideo(youtubeId);
      setSelectedVideoId(video.videoUrl);
      setCurrentVideoInfo(video);
      setShowQuiz(false);
      // Only auto-close playlist on mobile
      if (window.innerWidth < 1024) {
        setShowPlaylist(false);
      }
    }
  };

  // Updated handleTakeQuizClick to check login status
  const handleTakeQuizClick = () => {
    if (!isLoggedIn) {
      setShowLoginWarning(true);
    } else {
      // Original quiz logic
      setShowQuiz(true);
      setTimeout(() => {
        if (quizRef.current) {
          quizRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 3000);
    }
  };

  // Login warning modal handlers
  const handleLogin = () => {
    setShowLoginWarning(false);
    // Redirect to login page - adjust this path according to your routing
    window.location.href = '/login';
    // Or if using React Router:
    // navigate('/login');
  };

  const handleContinueWithoutLogin = () => {
    setShowLoginWarning(false);
    // Proceed with quiz but user is warned about no saving
    setShowQuiz(true);
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 500);
  };

  const handleNextVideo = () => {
    if (currentVideoInfo) {
      const currentIndex = flattenedVideos.findIndex(v => v.id === currentVideoInfo.id);
      if (currentIndex < flattenedVideos.length - 1) {
        handleVideoSelect(flattenedVideos[currentIndex + 1]);
      }
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoInfo) {
      const currentIndex = flattenedVideos.findIndex(v => v.id === currentVideoInfo.id);
      if (currentIndex > 0) {
        handleVideoSelect(flattenedVideos[currentIndex - 1]);
      }
    }
  };

  // Filter videos based on search query
  const filteredVideos = flattenedVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.topicName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading curriculum...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden ">
      {/* Playlist Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${showPlaylist ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'}
        lg:w-96 border-r border-gray-200 h-full
        
      `}>
        {/* Playlist Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 btn-gradient text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">{subjectName}</h2>
              <div className="flex items-center space-x-2 text-indigo-100 text-sm mt-1">
                <span className="bg-white/20 px-2 py-1 rounded">CBSE</span>
                <span>•</span>
                <span className="bg-white/20 px-2 py-1 rounded">Grade 10</span>
              </div>
            </div>
            {/* <button
              onClick={() => setShowPlaylist(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Search Bar - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Video List - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
          <div className="p-2 ">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 ">
                <FaVideo className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No videos found</p>
              </div>
            ) : (
              <div className="space-y-1 ">
                {filteredVideos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className={`
                      group cursor-pointer rounded-lg p-3 transition-all duration-200
                      ${currentVideoInfo?.id === video.id 
                        ? 'bg-indigo-50 border-l-4 border-indigo-500' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${currentVideoInfo?.id === video.id 
                          ? 'btn-gradient rounded-full text-white' 
                          : 'bg-gray-200 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }
                      `}>
                        {currentVideoInfo?.id === video.id ? (
                          <FaPlay className="w-3 h-3" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`
                          font-medium text-sm leading-tight mb-1
                          ${currentVideoInfo?.id === video.id ? 'text-indigo-900' : 'text-gray-900'}
                        `}>
                          {video.chapterName}
                        </h3>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <FaBook className="w-3 h-3 mr-1" />
                            <span className="truncate">{video.topicName}</span>
                          </div>
                          <div className="flex items-center">
                            <FaChevronRight className="w-3 h-3 mr-1" />
                            <span className="truncate">{video.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Playlist Stats - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 text-center">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${!showPlaylist ? 'lg:max-w-6xl lg:mx-auto lg:w-full' : ''}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <FaBars className="w-5 h-5 text-gray-600" />
              </button>
              {/* <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaList className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showPlaylist ? 'Hide' : 'Show'} Playlist
                </span>
              </button> */}
            </div>
            
            {currentVideoInfo && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousVideo}
                  disabled={flattenedVideos.findIndex(v => v.id === currentVideoInfo.id) === 0}
                  className="px-3 py-1 text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextVideo}
                  disabled={flattenedVideos.findIndex(v => v.id === currentVideoInfo.id) === flattenedVideos.length - 1}
                  className="px-3 py-1 text-sm btn-gradient text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 lg:p-6">
            {/* Quiz Saved Success Message */}
            {quizSavedSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center shadow-sm">
                <FaCheckCircle className="mr-3 text-green-600 flex-shrink-0" />
                <span className="font-medium">Your quiz has been successfully saved to your account!</span>
              </div>
            )}

            {selectedVideo && currentVideoInfo ? (
              <div className="space-y-6">
                {/* Video Player */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>

                {/* Video Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentVideoInfo.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      {currentVideoInfo.chapterName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {currentVideoInfo.topicName}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleTakeQuizClick}
                      className="px-6 py-3 btn-gradient text-white rounded-lg hover:bg-indigo-700 
                               transition-colors shadow-md hover:shadow-lg transform 
                               cursor-pointer transition-all duration-200 font-medium"
                    >
                      Take Quiz
                    </button>
                    {flattenedVideos.findIndex(v => v.id === currentVideoInfo.id) < flattenedVideos.length - 1 && (
                      <button
                        onClick={handleNextVideo}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                                 transition-colors font-medium cursor-pointer"
                      >
                        Next Video
                      </button>
                    )}
                  </div>
                </div>

                {/* Quiz Component */}
                {showQuiz && selectedVideoId && (
                  <div className="bg-white rounded-xl shadow-sm" ref={quizRef}>
                    <Quiz 
                      videoUrl={selectedVideoId}
                      curriculumData={curriculumData || undefined}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <FaVideo className="w-16 h-16 mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Video Selected</h3>
                <p className="text-center max-w-md">
                  Choose a video from the playlist to start your learning journey
                </p>
                <button
                  onClick={() => setShowPlaylist(true)}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Videos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile playlist */}
      {showPlaylist && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/40 z-40 lg:hidden"
          onClick={() => setShowPlaylist(false)}
        />
      )}

      {/* Login Warning Modal */}
      <LoginWarningModal
        isOpen={showLoginWarning}
        onClose={() => setShowLoginWarning(false)}
        onLogin={handleLogin}
        onContinue={handleContinueWithoutLogin}
      />
    </div>
  );
};

export default VideoPlayer;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import apiClient from '../services/apiClient';

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
  description: string;
  position: number;
}

interface QuizData {
  quiz: string;
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
      
        const response = await apiClient.get('user/playlists', {
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await apiClient.get('playlist/videos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          playlist_id: playlistId
        }
      });

      if (Array.isArray(response.data.videos)) {
        const videosWithDescription = response.data.videos.map((video: any) => ({
          ...video,
          description: video.description || 'No description available'
        }));
        setVideos(videosWithDescription);
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

  // Generate quiz for the current video
  const handleGenerateQuiz = async () => {
    if (!selectedVideo) return;
    
    setGeneratingQuiz(true);
    setQuizData(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await apiClient.post('generate_quiz', {
        video_id: selectedVideo.video_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      setQuizData(response.data);
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      setQuizData({
        error: err.response?.data?.error || 'Failed to generate quiz. Please try again.',
        quiz: ''
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    // Clear any existing quiz data when a new video is selected
    setQuizData(null);
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Header for mobile and playlist selector */}
      <div className="bg-white p-4 shadow-md md:hidden">
        <h2 className="text-xl font-bold text-gray-800">
          {subjectFromState ? `${subjectFromState} Videos` : 'Videos'}
        </h2>
        <select 
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={selectedPlaylist?.playlist_id || ''}
          onChange={handlePlaylistChange}
        >
          {playlists.map(playlist => (
            <option key={playlist.playlist_id} value={playlist.playlist_id}>
              {playlist.title}
            </option>
          ))}
        </select>
      </div>

      {/* Left sidebar - Video list */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md overflow-y-auto">
        <div className="p-4 border-b border-gray-200 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800">
            {subjectFromState ? `${subjectFromState} Videos` : 'Videos'}
          </h2>
          {/* <select 
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
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
        
        {loadingVideos ? (
          <div className="flex items-center justify-center h-48">
            <FaSpinner className="animate-spin text-2xl text-indigo-600" />
          </div>
        ) : videos.length > 0 ? (
          <ul>
            {videos.map((video) => (
              <li 
                key={video.video_id} 
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedVideo?.video_id === video.video_id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="font-medium text-gray-800">{video.title}</div>
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
      <div className="w-full md:w-2/3 lg:w-3/4 p-4 overflow-y-auto">
        {selectedVideo ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            {/* Video player */}
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
            
            {/* Generate Quiz Button */}
            <div className="p-4 flex justify-center">
              <button
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
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
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz</h2>
            {quizData.error ? (
              <div className="text-red-600">{quizData.error}</div>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-900 bg-gray-50 p-4 rounded-md">
                  {quizData.quiz}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubePlayer;
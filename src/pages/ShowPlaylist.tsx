import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import apiClient from '../services/apiClient';

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
  position: number;
}

const ShowPlaylist: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the subject from location state
  const subjectFromState = location.state?.subject;
  
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

        console.log('Playlist Response:', response.data.playlists);
        console.log('Looking for subject:', subjectFromState);

        if (Array.isArray(response.data.playlists)) {
          // Filter playlists by subject if available
          let filteredPlaylists = response.data.playlists;
          
          if (subjectFromState) {
            filteredPlaylists = response.data.playlists.filter(
              (playlist: Playlist) => playlist.subject === subjectFromState
            );
            console.log('Filtered playlists:', filteredPlaylists);
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
        setVideos(response.data.videos);
        // Select the first video by default
        if (response.data.videos.length > 0) {
          setSelectedVideo(response.data.videos[0]);
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

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    fetchVideos(playlist.playlist_id);
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with playlist list */}
      <div className="w-1/4 bg-white overflow-y-auto border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {subjectFromState ? `${subjectFromState} Playlists` : 'All Playlists'}
          </h2>
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.playlist_id}
                onClick={() => handlePlaylistClick(playlist)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPlaylist?.playlist_id === playlist.playlist_id
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{playlist.title}</h3>
                    <p className="text-sm text-gray-500">
                      {playlist.video_count} videos
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {selectedPlaylist ? (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedPlaylist.title}
              </h1>
              <div className="text-sm text-gray-600 mb-6">
                {selectedPlaylist.board} - Grade {selectedPlaylist.grade} - {selectedPlaylist.subject}
              </div>
              
              {/* Video list */}
              <div className="space-y-4">
                {loadingVideos ? (
                  <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                  </div>
                ) : videos.length > 0 ? (
                  videos.map((video) => (
                    <div
                      key={video.video_id}
                      onClick={() => handleVideoClick(video)}
                      className={`p-4 bg-white rounded-lg shadow cursor-pointer transition-colors ${
                        selectedVideo?.video_id === video.video_id
                          ? 'border-2 border-indigo-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-sm font-medium text-gray-500">
                            {video.position}.
                          </span>
                        </div>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-40 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{video.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No videos found in this playlist
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a playlist to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPlaylist; 
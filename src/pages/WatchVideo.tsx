import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../services/apiServices';
import { FaPlay } from 'react-icons/fa';

interface Playlist {
  board: string;
  grade: string;
  playlist_id: string;
  subject: string;
  thumbnail: string;
  title: string;
  video_count: number;
}

interface ApiResponse {
  playlists: Playlist[];
}

const WatchVideo: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        // Get URL parameters
        const params = new URLSearchParams(location.search);
        const board = params.get('board');
        const grade = params.get('grade');
        const subject = params.get('subject');

        // Make API call with parameters
        const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.GetPlaylist, {
          board,
          grade,
          subject
        });
        
        setPlaylists(response.data.playlists);
        // Set the first playlist as selected by default
        if (response.data.playlists.length > 0) {
          setSelectedPlaylist(response.data.playlists[0]);
        }
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/4 min-h-screen bg-white shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {playlists[0]?.subject || 'Course'} Videos
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {playlists[0]?.board} - Grade {playlists[0]?.grade}
            </p>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-100px)]">
            {playlists.map((playlist) => (
              <button
                key={playlist.playlist_id}
                onClick={() => setSelectedPlaylist(playlist)}
                className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors duration-200 flex items-start space-x-3 ${
                  selectedPlaylist?.playlist_id === playlist.playlist_id
                    ? 'bg-indigo-50 border-l-4 border-indigo-600'
                    : ''
                }`}
              >
                <div className="flex-shrink-0 w-24">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {playlist.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {playlist.video_count} videos
                  </p>
                </div>
                {selectedPlaylist?.playlist_id === playlist.playlist_id && (
                  <FaPlay className="text-indigo-600 mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Video Player */}
        <div className="flex-1 p-6">
          {selectedPlaylist ? (
            <div className="max-w-4xl mx-auto">
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist.playlist_id}`}
                  title={selectedPlaylist.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedPlaylist.title}
                </h1>
                <p className="mt-2 text-gray-600">
                  {selectedPlaylist.board} - Grade {selectedPlaylist.grade} - {selectedPlaylist.subject}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No playlist selected</h3>
              <p className="mt-2 text-gray-600">
                Please select a playlist from the sidebar to start watching
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchVideo; 
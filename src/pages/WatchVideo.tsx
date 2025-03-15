import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface Video {
  board: string;
  grade: string;
  subject: string;
  title: string;
  video_id: string;
}

interface ApiResponse {
  videos: Video[];
}

const WatchVideo: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Get URL parameters
        const params = new URLSearchParams(location.search);
        const board = params.get('board');
        const grade = params.get('grade');
        const subject = params.get('subject');

        // Make API call with parameters
        const response = await axios.get<ApiResponse>(`http://localhost:5000/get_videos?board=${board}&grade=${grade}&subject=${subject}`);
        
        setVideos(response.data.videos);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {videos[0]?.subject || 'Course'} Videos
          </h1>
          <p className="mt-2 text-gray-600">
            {videos[0]?.board} - Grade {videos[0]?.grade}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.video_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">
                    {video.subject} - Grade {video.grade}
                  </span>
                  <span className="text-sm text-gray-600">
                    {video.board}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
            <p className="mt-2 text-gray-600">
              Please check back later for new content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchVideo; 
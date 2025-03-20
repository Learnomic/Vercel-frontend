import React, { useState } from 'react';

// Define our video type
interface Video {
  id: string;
  title: string;
  description: string;
}

const YoutubePlayer: React.FC = () => {
  // Sample video data
  const initialVideos: Video[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
      description: 'The classic music video from 1987'
    },
    {
      id: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      description: 'Official music video for PSY - GANGNAM STYLE'
    },
    {
      id: 'jNQXAC9IVRw',
      title: 'Me at the zoo',
      description: 'The first video uploaded to YouTube'
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      description: 'Music video by Luis Fonsi featuring Daddy Yankee'
    }
  ];

  // State to keep track of the currently selected video
  const [selectedVideo, setSelectedVideo] = useState<Video>(initialVideos[0]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left sidebar - Video list */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Videos</h2>
        </div>
        <ul>
          {initialVideos.map((video) => (
            <li 
              key={video.id} 
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedVideo.id === video.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="font-medium text-gray-800">{video.title}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right content area - Video player */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Video player */}
          <div className="relative pt-0 pb-0 h-0" style={{ paddingBottom: '56.25%' }}>
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo.id}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Video info */}
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h1>
            <p className="mt-2 text-gray-600">{selectedVideo.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;
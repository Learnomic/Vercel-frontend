// import React, { useEffect, useState } from 'react';
// import apiClient from '../services/apiClient';
// import { FaClock } from 'react-icons/fa';

// interface VideoProgress {
//   current_time: number;
//   duration: number;
//   last_updated: string;
//   video_id: string;
// }

// const VideoProgressDisplay: React.FC<{ video_id: string}> = ({ video_id }) => {
//   const [progress, setProgress] = useState<VideoProgress | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProgress = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         const response = await apiClient.get(`http://localhost:5000/api/video/progress/${video_id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (response.data) {
//           setProgress(response.data);
//         }
//       } catch (err) {
//         console.error('Error fetching progress:', err);
//         setError('Failed to load progress');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProgress();
//   }, [video_id]);

//   if (loading || !progress) return null;
//   if (error) return <div className="text-red-500 text-sm">{error}</div>;

//   const progressPercentage = Math.round((progress.current_time / progress.duration) * 100);

//   return (
//     <div className="mt-2 p-2 bg-gray-50 rounded-md">
//       <div className="flex items-center text-sm text-gray-600">
//         <FaClock className="mr-1" />
//         <span>Your progress: {progressPercentage}%</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//         <div
//           className="bg-indigo-600 h-2 rounded-full"
//           style={{ width: `${progressPercentage}%` }}
//         />
//       </div>
//       <div className="text-xs text-gray-500 mt-1">
//         Last watched: {new Date(progress.last_updated).toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default VideoProgressDisplay;

// VideoProgressDisplay.tsx
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface VideoProgressDisplayProps {
  video_id: string;
  progress?: number; // Assuming we'll get progress from somewhere
}

const VideoProgressDisplay: React.FC<VideoProgressDisplayProps> = ({ video_id, progress = 0 }) => {
  return (
    <div className="w-6 h-6 ml-2">
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={{
          root: {},
          path: {
            stroke: `#4f46e5`, // Using indigo-600 color
          },
          trail: {
            stroke: '#e5e7eb', // Using gray-200 color
          },
          text: {
            fill: '#4f46e5', // Using indigo-600 color
            fontSize: '30px',
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
};

export default VideoProgressDisplay;
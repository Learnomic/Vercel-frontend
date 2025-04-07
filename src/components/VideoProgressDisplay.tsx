// VideoProgressDisplay.tsx
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface VideoProgressDisplayProps {
  video_id: string;
  progress?: number; // Assuming we'll get progress from somewhere
}

const VideoProgressDisplay: React.FC<VideoProgressDisplayProps> = ({ progress = 0 }) => {
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
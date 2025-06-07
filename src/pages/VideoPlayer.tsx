import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSpinner, FaChevronRight, FaChevronDown, FaPlay, FaCheckCircle } from 'react-icons/fa';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../services/apiServices';
import Quiz from './Quiz';

// Updated interfaces to match the actual API response
interface Video {
  _id: string;
  videoUrl: string;
}

interface Subtopic {
  _id: string;
  subtopicName: string; // Changed from 'name' to 'subtopicName'
  videos: Video[];
}

interface Topic {
  _id: string;
  topicName: string; // Changed from 'name' to 'topicName'
  subtopics: Subtopic[];
}

interface Chapter {
  _id: string;
  chapterName?: string; // Made optional since it's not in the response
  topics: Topic[];
}

// Updated to match actual API response structure
interface CurriculumResponse {
  success: boolean;
  data: {
    _id: string;
    chapters: Chapter[];
  };
}

const VideoPlayer: React.FC = () => {
  const [curriculumData, setCurriculumData] = useState<CurriculumResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSavedSuccess, setQuizSavedSuccess] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  
  // Check both location state and URL parameters
  const urlParams = new URLSearchParams(location.search);
  
  // Check if redirected from signup with a saved quiz
  const quizSavedState = location.state?.quizSaved;
  const quizSavedQuery = urlParams.get('quizSaved') === 'true';
  const quizSaved = quizSavedState || quizSavedQuery;
  
  const redirectVideoIdState = location.state?.videoId;
  const redirectVideoIdQuery = urlParams.get('videoId');
  const redirectVideoId = redirectVideoIdState || redirectVideoIdQuery;
  
  // Get subject info from location state
  const subjectName = location.state?.subjectName || location.state?.subject || "Science";

  console.log("Location state:", location.state);
  console.log("Subject Name:", subjectName);

  // Display success message when quiz is saved after signup
  useEffect(() => {
    if (quizSaved) {
      setQuizSavedSuccess(true);
      
      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setQuizSavedSuccess(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [quizSaved]);
  
  // Handle video selection when redirected with videoId
  useEffect(() => {
    // If we have a videoId from the redirect and curriculum data is loaded
    if (redirectVideoId && curriculumData) {
      console.log("Trying to find and select video with ID:", redirectVideoId);
      
      // Try to find the video in the curriculum data
      for (const chapter of curriculumData.chapters) {
        for (const topic of chapter.topics) {
          for (const subtopic of topic.subtopics) {
            for (const video of subtopic.videos) {
              if (video._id === redirectVideoId) {
                console.log("Found matching video, selecting it");
                // Found the video, select it
                const youtubeId = extractYoutubeId(video.videoUrl);
                if (youtubeId) {
                  setSelectedVideo(youtubeId);
                  setSelectedVideoId(video.videoUrl); // Store full video URL
                  
                  // Expand the chapter and topic
                  setExpandedChapters(prev => new Set([...prev, chapter._id]));
                  setExpandedTopics(prev => new Set([...prev, topic._id]));
                }
                return;
              }
            }
          }
        }
      }
      
      console.log("Could not find video with ID:", redirectVideoId);
    }
  }, [redirectVideoId, curriculumData]);

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
        return match[1].split('?')[0]; // Remove any additional parameters
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        // Check if we have subjectName, otherwise show error
        if (!subjectName) {
          setError('Subject name is required to load curriculum');
          return;
        }

        console.log('Fetching curriculum for subject:', subjectName);

        // Use subjectName instead of subjectId in the API call
        const response = await apiClient.get(
          `${API_ENDPOINTS.GetCurriculum}${subjectName}`
        );

        console.log('Curriculum response:', response.data);
        
        // Handle the nested response structure
        const responseData = response.data.success ? response.data.data : response.data;
        setCurriculumData(responseData);

        // Find first video in the curriculum
        const firstChapter = responseData?.chapters[0];
        if (firstChapter && firstChapter.topics) {
          // Expand first chapter
          setExpandedChapters(new Set([firstChapter._id]));
          
          // Find first topic with videos
          for (const topic of firstChapter.topics) {
            if (topic.subtopics) {
              for (const subtopic of topic.subtopics) {
                if (subtopic.videos && subtopic.videos.length > 0) {
                  // Found first video, expand its topic and play it
                  setExpandedTopics(new Set([topic._id]));
                  const firstVideo = subtopic.videos[0];
                  const youtubeId = extractYoutubeId(firstVideo.videoUrl);
                  if (youtubeId) {
                    setSelectedVideo(youtubeId);
                    setSelectedVideoId(firstVideo.videoUrl); // Store full video URL
                  }
                  return; // Exit once we've found and set the first video
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching curriculum:', err);
        setError(err.response?.data?.message || 'Failed to load curriculum');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have subjectName
    if (subjectName) {
      setExpandedChapters(new Set());
      setExpandedTopics(new Set());
      setSelectedVideo(null);
      setSelectedVideoId(null);
      setLoading(true);
      
      fetchCurriculum();
    } else {
      setLoading(false);
      setError('Subject name is required to load curriculum');
    }
  }, [subjectName]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };
  
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const handleVideoSelect = (videoUrl: string, videoId: string) => {
    console.log('Selected video URL:', videoUrl);
    console.log('Selected video ID:', videoId);
    // Extract video ID from YouTube URL for player
    const youtubeId = extractYoutubeId(videoUrl);
    if (youtubeId) {
      setSelectedVideo(youtubeId);
      setSelectedVideoId(videoUrl); // Store full video URL
      setShowQuiz(false);
    }
  };

  // Function to handle quiz button click
  const handleTakeQuizClick = () => {
    setShowQuiz(true);
    
    // Use setTimeout to ensure the quiz component is rendered before scrolling
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 500);
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
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
    
      {/* Left Sidebar - Curriculum Structure */}
      <div 
        className={`fixed md:static inset-y-0 left-0 w-4/5 md:w-1/4 bg-gradient-to-b from-indigo-50 to-white overflow-y-auto shadow-lg z-50 transition-transform duration-300 transform ${
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:shadow-none md:z-0 border-r border-indigo-100`}
      >
      
        {/* Desktop sidebar header */}
        <div className="p-6 border-b border-indigo-100 bg-white hidden md:block sticky top-0 z-10">
          <h2 className="text-xl font-bold text-indigo-800">{subjectName}</h2>
          <div className="text-sm text-indigo-600 mt-1 flex items-center">
            <span className="bg-indigo-100 px-2 py-1 rounded-md">CBSE</span>
            <span className="mx-2">•</span>
            <span className="bg-indigo-100 px-2 py-1 rounded-md">Grade 10</span>
          </div>
        </div>
        
        {/* Chapters List */}
        <div className="p-4">
          {curriculumData?.chapters.map((chapter, chapterIndex) => (
            <div key={chapter._id} className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter._id)}
                className={`flex items-center w-full p-3 ${expandedChapters.has(chapter._id) ? 'bg-indigo-50' : 'bg-white'} transition-colors duration-200`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${expandedChapters.has(chapter._id) ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                  {expandedChapters.has(chapter._id) ? (
                    <FaChevronDown className="w-3 h-3" />
                  ) : (
                    <FaChevronRight className="w-3 h-3" />
                  )}
                </div>
                <span className="font-medium text-black-800">
                  {chapter.chapterName || `Chapter ${chapterIndex + 1}`}
                </span>
              </button>

              {/* Topics List */}
              {expandedChapters.has(chapter._id) && (
                <div className="border-t border-indigo-50">
                  {chapter.topics?.map(topic => (
                    <div key={topic._id} className="border-b border-indigo-50 last:border-b-0">
                      <button
                        onClick={() => toggleTopic(topic._id)}
                        className={`flex items-center w-full p-3 pl-6 ${expandedTopics.has(topic._id) ? 'bg-indigo-50/50' : 'bg-white'} hover:bg-indigo-50/30 transition-colors duration-200`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${expandedTopics.has(topic._id) ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-500'}`}>
                          {expandedTopics.has(topic._id) ? (
                            <FaChevronDown className="w-2 h-2" />
                          ) : (
                            <FaChevronRight className="w-2 h-2" />
                          )}
                        </div>
                        <span className="text-md text-black-700">{topic.topicName}</span>
                      </button>

                      {/* Subtopics and Videos */}
                      {expandedTopics.has(topic._id) && (
                        <div className="bg-indigo-50/30 py-2">
                          {topic.subtopics?.map(subtopic => (
                            <div key={subtopic._id}>
                              <button
                                onClick={() => {
                                  if (subtopic.videos.length > 0) {
                                    handleVideoSelect(subtopic.videos[0].videoUrl, subtopic.videos[0]._id);
                                    setShowSidebar(false);
                                  }
                                }}
                                className={`flex items-center w-full py-2 px-4 ml-8 my-1 rounded-l-full ${
                                  selectedVideo && subtopic.videos.length > 0 && subtopic.videos[0].videoUrl.includes(selectedVideo) 
                                    ? 'bg-indigo-100 border-r-4 border-indigo-600' 
                                    : 'hover:bg-indigo-100/50'
                                } transition-all duration-200 ${subtopic.videos.length > 0 ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                              >
                                {subtopic.videos.length > 0 && (
                                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-2 shadow-sm">
                                    <FaPlay className="w-2 h-2 text-indigo-600" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-black-700 truncate">{subtopic.subtopicName}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Video Player */}
      <div className="flex-1 p-4 md:p-6 mt-0 md:mt-0 overflow-y-auto">
        {/* Quiz Saved Success Message */}
        {quizSavedSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center shadow-md">
            <FaCheckCircle className="mr-2 text-green-600" />
            <span className="font-medium">Your quiz has been successfully saved to your account!</span>
          </div>
        )}
      
        {selectedVideo ? (
          <div>
            <div className="w-full" style={{ height: "calc(100vw * 9/16)" , maxHeight: "500px" }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              />
            </div>
            {/* Take Quiz Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleTakeQuizClick}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                         transition-colors shadow-md hover:shadow-lg transform 
                         hover:-translate-y-0.5 transition-all duration-200"
              >
                Take Quiz
              </button>
            </div>

            {/* Quiz Component */}
            {showQuiz && selectedVideoId && (
              <div className="mt-6" ref={quizRef}>
                <Quiz 
                  videoUrl={selectedVideoId}
                  curriculumData={curriculumData || undefined}
                />
              </div>
            )}

            {/* Mobile Topic List */}
            <div className="md:hidden mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Content</h3>
              <div className="space-y-2">
                {curriculumData?.chapters.map((chapter, chapterIndex) => (
                  <div key={chapter._id} className="bg-white rounded-lg shadow-sm">
                    <button
                      onClick={() => toggleChapter(chapter._id)}
                      className="flex items-center w-full p-3 bg-indigo-50 rounded-t-lg"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${expandedChapters.has(chapter._id) ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                        {expandedChapters.has(chapter._id) ? (
                          <FaChevronDown className="w-3 h-3" />
                        ) : (
                          <FaChevronRight className="w-3 h-3" />
                        )}
                      </div>
                      <span className="font-medium text-gray-800">
                        {chapter.chapterName || `Chapter ${chapterIndex + 1}`}
                      </span>
                    </button>

                    {expandedChapters.has(chapter._id) && (
                      <div className="p-2">
                        {chapter.topics?.map(topic => (
                          <div key={topic._id} className="mb-2">
                            <button
                              onClick={() => toggleTopic(topic._id)}
                              className="flex items-center w-full p-2 bg-gray-50 rounded-lg"
                            >
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${expandedTopics.has(topic._id) ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-500'}`}>
                                {expandedTopics.has(topic._id) ? (
                                  <FaChevronDown className="w-2 h-2" />
                                ) : (
                                  <FaChevronRight className="w-2 h-2" />
                                )}
                              </div>
                              <span className="text-sm text-gray-700">{topic.topicName}</span>
                            </button>

                            {expandedTopics.has(topic._id) && (
                              <div className="ml-6 mt-1 space-y-1">
                                {topic.subtopics?.map(subtopic => (
                                  <button
                                    key={subtopic._id}
                                    onClick={() => {
                                      if (subtopic.videos.length > 0) {
                                        handleVideoSelect(subtopic.videos[0].videoUrl, subtopic.videos[0]._id);
                                      }
                                    }}
                                    className={`flex items-center w-full p-2 rounded-lg text-sm ${
                                      selectedVideo && subtopic.videos.length > 0 && subtopic.videos[0].videoUrl.includes(selectedVideo)
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'hover:bg-gray-100 text-gray-600'
                                    } ${subtopic.videos.length > 0 ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                                  >
                                    {subtopic.videos.length > 0 && (
                                      <FaPlay className="w-3 h-3 mr-2 text-indigo-500" />
                                    )}
                                    {subtopic.subtopicName}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a video from the curriculum to start learning
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
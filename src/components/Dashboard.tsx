import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Film, 
  PlayCircle,
  TrendingUp,
  Award,
  BarChart,
  Trophy,
  Target
} from 'lucide-react';
import { API_ENDPOINTS } from '../services/apiServices';
import apiClient from '../services/apiClient';

interface QuizFeedback {
  correct_answer: string;
  is_correct: boolean;
  question_number: number;
  user_answer: string;
}

interface Score {
  correct: number;
  percentage: number;
  total: number;
}

interface RecentActivity {
  _id: string;
  created_at: string;
  feedback: QuizFeedback[];
  playlist_id: string;
  score: Score;
  subject_id: string;
  video_id: string;
}

interface WeekProgress {
  average_score: number;
  quizzes_taken: number;
  week: string;
  week_label: string;
}

interface SubjectBreakdown {
  average_score: number;
  name: string;
  quizzes_taken: number;
  subject_id: string;
}

interface Achievement {
  description: string;
  earned: boolean;
  id: string;
  name: string;
  percentage: number;
  progress: number;
  threshold: number;
}

interface AchievementsData {
  achievements: Achievement[];
  total_available: number;
  total_earned: number;
}

interface UserProgress {
  average_score: number;
  completed_playlists: number;
  completed_videos: number;
  highest_score: number;
  progress_over_time: WeekProgress[];
  recent_activity: RecentActivity[];
  subject_breakdown: SubjectBreakdown[];
  total_quizzes: number;
}

// Default empty user progress to avoid undefined errors
const defaultUserProgress: UserProgress = {
  average_score: 0,
  completed_playlists: 0,
  completed_videos: 0,
  highest_score: 0,
  progress_over_time: [],
  recent_activity: [],
  subject_breakdown: [],
  total_quizzes: 0
};

// Default empty achievements data
const defaultAchievements: AchievementsData = {
  achievements: [],
  total_available: 0,
  total_earned: 0
};

const Dashboard: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress);
  const [achievements, setAchievements] = useState<AchievementsData>(defaultAchievements);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Check if token exists and redirect to login if not
        if (!token) {
          // Redirect to login page or show auth error
          setError('Authentication required. Please log in.');
          return;
        }
        
        // Use authorization header with Bearer token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        // Fetch user progress and achievements in parallel
        const [progressResponse, achievementsResponse] = await Promise.all([
          apiClient.get(API_ENDPOINTS.GetUserProgress, config),
          apiClient.get(API_ENDPOINTS.GetAchievements, config)
        ]);
        
        console.log("User progress data:", progressResponse.data);
        console.log("Achievements data:", achievementsResponse.data);
        
        // Validate response data before setting state
        if (progressResponse.data) {
          setUserProgress(progressResponse.data);
        } else {
          throw new Error('Invalid progress data received from server');
        }
        
        if (achievementsResponse.data) {
          setAchievements(achievementsResponse.data);
        } else {
          throw new Error('Invalid achievements data received from server');
        }
        
        setError(null);
      } catch (err: any) {
        // Handle specific error cases
        if (err.response) {
          // Server responded with an error
          if (err.response.status === 401) {
            setError('Your session has expired. Please log in again.');
            // Clear invalid token
            localStorage.removeItem('token');
          } else {
            setError(`Failed to fetch data: ${err.response.data?.message || 'Server error'}`);
          }
        } else if (err.request) {
          // No response received
          setError('Cannot connect to server. Please check your connection.');
        } else {
          // Other errors
          setError('Failed to fetch dashboard data. Please try again later.');
        }
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading your progress...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p className="font-medium">{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          {error.includes('session') && (
            <button 
              className="mt-2 ml-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors" 
              onClick={() => window.location.href = '/login'}
            >
              Log In Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Average Score" 
          value={`${userProgress.average_score || 0}%`} 
          icon={<Award className="text-emerald-600" />}
          description="Your overall quiz performance"
          color="bg-emerald-50"
        />
        <StatsCard 
          title="Highest Score" 
          value={`${userProgress.highest_score || 0}%`} 
          icon={<TrendingUp className="text-blue-600" />}
          description="Your best quiz result"
          color="bg-blue-50"
        />
        <StatsCard 
          title="Completed Videos" 
          value={String(userProgress.completed_videos || 0)} 
          icon={<Film className="text-purple-600" />}
          description="Videos watched with quizzes"
          color="bg-purple-50"
        />
        <StatsCard 
          title="Total Quizzes" 
          value={String(userProgress.total_quizzes || 0)} 
          icon={<CheckCircle className="text-amber-600" />}
          description="Quizzes completed"
          color="bg-amber-50"
        />
      </div>
      
      {/* Achievements Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Achievements
          </h2>
          <span className="text-sm text-gray-500">
            {achievements.total_earned} of {achievements.total_available} earned
          </span>
        </div>
        
        {achievements.achievements && achievements.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border ${achievement.earned ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
              >
                <div className="flex items-start mb-2">
                  <div className={`p-2 rounded-full mr-3 ${achievement.earned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${achievement.earned ? 'text-amber-700' : 'text-gray-700'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <div className="pl-10">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{achievement.progress} / {achievement.threshold}</span>
                    <span>{achievement.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${achievement.earned ? 'bg-amber-500' : 'bg-blue-500'}`}
                      style={{ width: `${achievement.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No achievements data available.</p>
        )}
      </div>
      
      {/* Progress Over Time Chart */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Progress Over Time</h2>
          <span className="text-sm text-gray-500">Weekly average scores</span>
        </div>
        {userProgress.progress_over_time && userProgress.progress_over_time.length > 0 ? (
          <div className="h-64">
            <ProgressChart progressData={userProgress.progress_over_time} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Not enough data yet to show progress over time.</p>
          </div>
        )}
      </div>
       */}
      {/* Two Column Layout for Recent Activity and Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" /> Recent Activity
            </h2>
            {userProgress.recent_activity && userProgress.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {userProgress.recent_activity.map((activity) => (
                  <div key={activity._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Quiz completed for video</h3>
                          <p className="text-sm text-gray-500">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          activity.score.percentage >= 80 ? 'bg-green-100 text-green-800' :
                          activity.score.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.score.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="pl-10">
                      <p className="text-sm mb-1">
                        Score: {activity.score.correct}/{activity.score.total} correct
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.feedback.map((item) => (
                          <span 
                            key={`${activity._id}-q${item.question_number}`}
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.is_correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}
                          >
                            Q{item.question_number}: {item.is_correct ? '✓' : '✗'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activity to display.</p>
            )}
          </div>
        </div>
        
        {/* Subject Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" /> Subject Breakdown
            </h2>
            {userProgress.subject_breakdown && userProgress.subject_breakdown.length > 0 ? (
              <div className="space-y-4">
                {userProgress.subject_breakdown.map((subject) => (
                  <div key={subject.subject_id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{subject.name}</h3>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        subject.average_score >= 80 ? 'bg-green-100 text-green-800' :
                        subject.average_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {subject.average_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          subject.average_score >= 80 ? 'bg-green-600' :
                          subject.average_score >= 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${subject.average_score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {subject.quizzes_taken} quizzes taken
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subject data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description, color }) => {
  return (
    <div className={`p-6 rounded-xl ${color} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

// const ProgressChart: React.FC<{ progressData: WeekProgress[] }> = ({ progressData }) => {
//   // For this simple implementation, we'll use a bar representation
//   return (
//     <div className="h-full flex items-end space-x-2">
//       {progressData.map((data, index) => (
//         <div key={index} className="flex-1 flex flex-col items-center">
//           <div 
//             className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors"
//             style={{ height: `${data.average_score}%` }}
//           ></div>
//           <div className="pt-2 text-xs text-center">
//             <div className="font-medium">{data.week_label}</div>
//             <div className="text-gray-500">{data.quizzes_taken} quizzes</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

export default Dashboard;
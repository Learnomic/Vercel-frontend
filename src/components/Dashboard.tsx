// import React, { useState, useEffect } from 'react';
// import { 
//   BookOpen, 
//   Film, 
//   TrendingUp,
//   Award,
//   Trophy,
//   Target,
//   Star,
//   Users,
//   Calendar,
//   CheckCircle,
//   Brain,
//   Zap,
//   History,
//   BarChart,
// } from 'lucide-react';
// import { API_ENDPOINTS } from '../services/apiServices';
// import apiClient from '../services/apiClient';

// interface Achievement {
//   name: string;
//   description: string;
//   progress: number;
//   current: number;
//   threshold: number;
//   unit: string;
//   completed: boolean;
// }

// interface ScoreDistribution {
//   low: number;
//   mid: number;
//   high: number;
// }

// interface QuizzesBySubject {
//   [key: string]: number;
// }

// interface FunFact {
//   id: number;
//   text: string;
//   category: string;
//   icon: string;
// }

// interface QuizHistory {
//   id: string;
//   subject: string;
//   score: number;
//   totalQuestions: number;
//   correctAnswers: number;
//   timeTaken: number;
//   date: string;
//   topic: string;
//   subtopic: string;
// }

// interface UserStats {
//   totalTimeSpent: number;
//   currentStreak: number;
//   longestStreak: number;
//   totalPointsEarned: number;
//   level: number;
//   experience: number;
// }

// interface SubjectProgress {
//   subjectId: string;
//   subjectName: string;
//   totalQuizzes: number;
//   averageScore: number;
//   totalTimeSpent: number;
//   completedTopics: string[];
// }

// interface PerformanceData {
//   date: string;
//   score: number;
//   subject: string;
//   topic: string;
//   subtopic: string;
// }

// interface ChartData {
//   scoreDistribution: ScoreDistribution;
//   quizzesBySubject: QuizzesBySubject;
//   performanceOverTime: PerformanceData[];
//   subjectPerformance: SubjectProgress[];
// }

// interface DashboardData {
//   averageScore: number;
//   highestScore: number;
//   completedVideos: number;
//   totalQuizzes: number;
//   achievements: Achievement[];
//   chartData: ChartData;
//   funFacts: FunFact[];
//   recentQuizHistory: QuizHistory[];
//   userStats: UserStats;
//   subjectProgress: SubjectProgress[];
// }

// const getElapsedTime = (dateString: string): string => {
//   const quizDate = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - quizDate.getTime()) / 1000);

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds}s ago`;
//   } else if (diffInSeconds < 3600) {
//     const minutes = Math.floor(diffInSeconds / 60);
//     return `${minutes}m ago`;
//   } else if (diffInSeconds < 86400) {
//     const hours = Math.floor(diffInSeconds / 3600);
//     return `${hours}h ago`;
//   } else if (diffInSeconds < 604800) {
//     const days = Math.floor(diffInSeconds / 86400);
//     return `${days}d ago`;
//   } else {
//     return new Date(dateString).toLocaleDateString();
//   }
// };

// const Dashboard: React.FC = () => {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           setError('Authentication required. Please log in.');
//           return;
//         }
        
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         };
        
//         const response = await apiClient.get(API_ENDPOINTS.GetDashboard, config);
//         console.log("Dashboard data:", response.data);
        
//         if (response.data && response.data.data) {
//           setDashboardData(response.data.data);
//         } else {
//           throw new Error('Invalid dashboard data received from server');
//         }
        
//         setError(null);
//       } catch (err: any) {
//         if (err.response) {
//           if (err.response.status === 401) {
//             setError('Your session has expired. Please log in again.');
//             localStorage.removeItem('token');
//           } else {
//             setError(`Failed to fetch data: ${err.response.data?.message || 'Server error'}`);
//           }
//         } else if (err.request) {
//           setError('Cannot connect to server. Please check your connection.');
//         } else {
//           setError('Failed to fetch dashboard data. Please try again later.');
//         }
//         console.error('Error fetching dashboard data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Generate achievement data from the API response
//   const getAchievementData = () => {
//     if (!dashboardData || !dashboardData.achievements) return [];
//     // Helper to pick icon based on achievement name
//     const getIcon = (name: string) => {
//       switch (name.toUpperCase()) {
//         case 'FIRST STEPS':
//           return <Star className="w-5 h-5" />;
//         case 'QUIZ APPRENTICE':
//           return <BookOpen className="w-5 h-5" />;
//         case 'QUIZ MASTER':
//           return <Trophy className="w-5 h-5" />;
//         case 'PERFECT SCORE':
//           return <Target className="w-5 h-5" />;
//         case 'HIGH PERFORMER':
//           return <TrendingUp className="w-5 h-5" />;
//         case 'SUBJECT EXPLORER':
//           return <Users className="w-5 h-5" />;
//         case 'WEEKLY WARRIOR':
//           return <Calendar className="w-5 h-5" />;
//         default:
//           return <Award className="w-5 h-5" />;
//       }
//     };

//     return dashboardData.achievements.map((achievement) => ({
//       id: achievement.name.toLowerCase().replace(/\s/g, ''),
//       title: achievement.name.replace(/_/g, ' '),
//       description: achievement.description,
//       earned: achievement.completed,
//       icon: getIcon(achievement.name),
//       progress: Math.min(achievement.progress, 100),
//       current: achievement.current,
//       target: achievement.threshold,
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
//         <span className="ml-2">Loading your progress...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center">
//         <div className="bg-red-50 text-red-700 p-4 rounded-lg">
//           <p className="font-medium">{error}</p>
//           <button 
//             className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors" 
//             onClick={() => window.location.reload()}
//           >
//             Try Again
//           </button>
//           {error.includes('session') && (
//             <button 
//               className="mt-2 ml-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors" 
//               onClick={() => window.location.href = '/login'}
//             >
//               Log In Again
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return null;
//   }

//   const achievementData = getAchievementData();
//   const earnedAchievements = achievementData.filter(a => a.earned).length;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
      
//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <StatsCard 
//           title="Average Score" 
//           value={`${dashboardData?.averageScore?.toFixed?.(1) ?? 0}%`} 
//           icon={<Award className="text-emerald-600" />}
//           description="Your overall quiz performance"
//           color="bg-emerald-50"
//         />
//         <StatsCard 
//           title="Highest Score" 
//           value={`${dashboardData.highestScore}%`} 
//           icon={<TrendingUp className="text-blue-600" />}
//           description="Your best quiz result"
//           color="bg-blue-50"
//         />
//         <StatsCard 
//           title="Completed Videos" 
//           value={String(dashboardData.completedVideos)} 
//           icon={<Film className="text-purple-600" />}
//           description="Videos watched with quizzes"
//           color="bg-purple-50"
//         />
//         <StatsCard 
//           title="Total Quizzes" 
//           value={String(dashboardData.totalQuizzes)} 
//           icon={<CheckCircle className="text-orange-600" />}
//           description="Quizzes completed"
//           color="bg-orange-50"
//         />
//       </div>
      
//       {/* Achievements Section */}
//       <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold flex items-center">
//             <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Achievements
//           </h2>
//           <span className="text-sm text-gray-500">
//             {earnedAchievements} of {achievementData.length} earned
//           </span>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {achievementData.map((achievement) => (
//             <div 
//               key={achievement.id} 
//               className={`p-4 rounded-lg border ${achievement.earned ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
//             >
//               <div className="flex items-start mb-2">
//                 <div className={`p-2 rounded-full mr-3 ${achievement.earned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
//                   {achievement.icon}
//                 </div>
//                 <div>
//                   <h3 className={`font-medium ${achievement.earned ? 'text-amber-700' : 'text-gray-700'}`}>
//                     {achievement.title}
//                   </h3>
//                   <p className="text-sm text-gray-500">{achievement.description}</p>
//                 </div>
//               </div>
//               <div className="pl-10">
//                 <div className="flex items-center justify-between text-sm mb-1">
//                   <span>{achievement.current} / {achievement.target}</span>
//                   <span>{Math.round(achievement.progress)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className={`h-2 rounded-full ${achievement.earned ? 'bg-amber-500' : 'bg-blue-500'}`}
//                     style={{ width: `${achievement.progress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Score Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <TrendingUp className="w-5 h-5 mr-2" /> Score Distribution
//           </h2>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium text-red-600">Low (0-59%)</span>
//               <span className="text-sm text-gray-600">{dashboardData?.chartData?.scoreDistribution?.low ?? 0} quizzes</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div 
//                 className="h-3 rounded-full bg-red-500"
//                 style={{
//                   width: `${dashboardData?.chartData?.scoreDistribution?.low && dashboardData?.totalQuizzes ? (dashboardData.chartData.scoreDistribution.low / dashboardData.totalQuizzes) * 100 : 0}%`
//                 }}
//               ></div>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium text-yellow-600">Medium (60-79%)</span>
//               <span className="text-sm text-gray-600">{dashboardData?.chartData?.scoreDistribution?.mid ?? 0} quizzes</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div 
//                 className="h-3 rounded-full bg-yellow-500"
//                 style={{
//                   width: `${dashboardData?.chartData?.scoreDistribution?.mid && dashboardData?.totalQuizzes ? (dashboardData.chartData.scoreDistribution.mid / dashboardData.totalQuizzes) * 100 : 0}%`
//                 }}
//               ></div>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium text-green-600">High (80-100%)</span>
//               <span className="text-sm text-gray-600">{dashboardData?.chartData?.scoreDistribution?.high ?? 0} quizzes</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div 
//                 className="h-3 rounded-full bg-green-500"
//                 style={{
//                   width: `${dashboardData?.chartData?.scoreDistribution?.high && dashboardData?.totalQuizzes ? (dashboardData.chartData.scoreDistribution.high / dashboardData.totalQuizzes) * 100 : 0}%`
//                 }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Subject Breakdown */}
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <BookOpen className="w-5 h-5 mr-2" /> Quizzes by Subject
//           </h2>
//           <div className="space-y-4">
//             {Object.entries(dashboardData?.chartData?.quizzesBySubject ?? {}).map(([subject, count]) => (
//               <div key={subject} className="border-b pb-4 last:border-b-0 last:pb-0">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-medium">{subject === 'undefined' ? 'Unknown Subject' : subject}</h3>
//                   <span className="text-sm font-medium text-gray-600">
//                     {count} quizzes
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div 
//                     className="h-2.5 rounded-full bg-blue-600"
//                     style={{ width: `${dashboardData?.totalQuizzes ? (Number(count) / dashboardData.totalQuizzes) * 100 : 0}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-2">
//                   {dashboardData?.totalQuizzes ? Math.round((Number(count) / dashboardData.totalQuizzes) * 100) : 0}% of total quizzes
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Performance Summary */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <Award className="w-5 h-5 mr-2" /> Performance Summary
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="text-center p-4 bg-blue-50 rounded-lg">
//             <div className="text-2xl font-bold text-blue-600 mb-2">
//               {dashboardData.totalQuizzes}
//             </div>
//             <div className="text-sm text-gray-600">Total Quizzes Taken</div>
//           </div>
//           <div className="text-center p-4 bg-green-50 rounded-lg">
//             <div className="text-2xl font-bold text-green-600 mb-2">
//               {dashboardData?.achievements?.find(a => a.name === 'PERFECT SCORE')?.current ?? 0}
//             </div>
//             <div className="text-sm text-gray-600">Perfect Scores</div>
//           </div>
//           <div className="text-center p-4 bg-purple-50 rounded-lg">
//             <div className="text-2xl font-bold text-purple-600 mb-2">
//               {dashboardData?.achievements?.find(a => a.name === 'SUBJECT EXPLORER')?.current ?? 0}
//             </div>
//             <div className="text-sm text-gray-600">Subjects Explored</div>
//           </div>
//         </div>
//       </div>

//       {/* Fun Facts Section */}
//       <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <Brain className="w-5 h-5 mr-2" /> Fun Facts & Tips
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {dashboardData.funFacts.map((fact) => (
//             <div key={fact.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
//               <div className="flex items-start">
//                 <span className="text-2xl mr-3">{fact.icon}</span>
//                 <div>
//                   <p className="text-sm text-gray-700">{fact.text}</p>
//                   <span className="text-xs text-gray-500 mt-2 block">{fact.category}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* User Stats Section */}
//       <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <Zap className="w-5 h-5 mr-2" /> Your Stats
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
//             <div className="text-2xl font-bold text-purple-600 mb-2">
//               Level {dashboardData.userStats.level}
//             </div>
//             <div className="text-sm text-gray-600">Current Level</div>
//           </div>
//           <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
//             <div className="text-2xl font-bold text-green-600 mb-2">
//               {dashboardData.userStats.currentStreak}
//             </div>
//             <div className="text-sm text-gray-600">Day Streak</div>
//           </div>
//           <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
//             <div className="text-2xl font-bold text-blue-600 mb-2">
//               {Math.floor(dashboardData.userStats.totalTimeSpent / 60)}m
//             </div>
//             <div className="text-sm text-gray-600">Time Spent</div>
//           </div>
//           <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
//             <div className="text-2xl font-bold text-amber-600 mb-2">
//               {dashboardData.userStats.totalPointsEarned}
//             </div>
//             <div className="text-sm text-gray-600">Points Earned</div>
//           </div>
//           <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
//             <div className="text-2xl font-bold text-red-600 mb-2">
//               {dashboardData.userStats.longestStreak}
//             </div>
//             <div className="text-sm text-gray-600">Longest Streak</div>
//           </div>
//           <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg">
//             <div className="text-2xl font-bold text-indigo-600 mb-2">
//               {dashboardData.userStats.experience}
//             </div>
//             <div className="text-sm text-gray-600">Experience Points</div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Quiz History */}
//       <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <History className="w-5 h-5 mr-2" /> Recent Quiz History
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
//                 <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Subject</th>
//                 <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Topic</th>
//                 <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
//                 <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {dashboardData.recentQuizHistory.map((quiz) => (
//                 <tr key={quiz.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 text-sm text-gray-900">
//                     {new Date(quiz.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-2 text-sm text-gray-900">{quiz.subject}</td>
//                   <td className="px-4 py-2 text-sm text-gray-900">{quiz.topic}</td>
//                   <td className="px-4 py-2 text-sm text-gray-900">{quiz.score}%</td>
//                   <td className="px-4 py-2 text-sm text-gray-900">{getElapsedTime(quiz.date)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Subject Progress */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <BarChart className="w-5 h-5 mr-2" /> Subject Progress
//         </h2>
//         <div className="space-y-6">
//           {dashboardData.subjectProgress.map((subject) => (
//             <div key={subject.subjectId} className="border-b pb-6 last:border-b-0 last:pb-0">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium">{subject.subjectName}</h3>
//                 <div className="text-sm text-gray-500">
//                   {Math.floor(subject.totalTimeSpent / 60)} minutes spent
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-600">Total Quizzes</div>
//                   <div className="text-xl font-semibold text-blue-600">{subject.totalQuizzes}</div>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-600">Average Score</div>
//                   <div className="text-xl font-semibold text-green-600">{subject.averageScore}%</div>
//                 </div>
//                 <div className="bg-purple-50 p-4 rounded-lg">
//                   <div className="text-sm text-gray-600">Completed Topics</div>
//                   <div className="text-xl font-semibold text-purple-600">{subject.completedTopics.length}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// interface StatsCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
//   description: string;
//   color: string;
// }

// const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description, color }) => {
//   return (
//     <div className={`p-6 rounded-xl ${color} transition-all hover:shadow-md`}>
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-lg font-medium">{title}</h3>
//         {icon}
//       </div>
//       <p className="text-3xl font-bold mb-1">{value}</p>
//       <p className="text-sm text-gray-600">{description}</p>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Film, 
  TrendingUp,
  Award,
  Trophy,
  Target,
  Star,
  Users,
  Calendar,
  CheckCircle,
  Brain,
  Zap,
  History,
  BarChart,
} from 'lucide-react';
import { API_ENDPOINTS } from '../services/apiServices';
import apiClient from '../services/apiClient';

interface Achievement {
  name: string;
  description: string;
  progress: number;
  current: number;
  threshold: number;
  unit: string;
  completed: boolean;
}

interface ScoreDistribution {
  low: number;
  mid: number;
  high: number;
}

interface QuizzesBySubject {
  [key: string]: number;
}

interface FunFact {
  id: number;
  text: string;
  category: string;
  icon: string;
}

interface QuizHistory {
  id: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  date: string;
  topic: string;
  subtopic: string;
}

interface UserStats {
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  totalPointsEarned: number;
  level: number;
  experience: number;
}

interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  totalQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  completedTopics: string[];
}

interface PerformanceData {
  date: string;
  score: number;
  subject: string;
  topic: string;
  subtopic: string;
}

interface ChartData {
  scoreDistribution: ScoreDistribution;
  quizzesBySubject: QuizzesBySubject;
  performanceOverTime: PerformanceData[];
  subjectPerformance: SubjectProgress[];
}

interface DashboardData {
  averageScore: number;
  highestScore: number;
  completedVideos: number;
  totalQuizzes: number;
  achievements: Achievement[];
  chartData: ChartData;
  funFacts: FunFact[];
  recentQuizHistory: QuizHistory[];
  userStats: UserStats;
  subjectProgress: SubjectProgress[];
}

// const getElapsedTime = (dateString: string): string => {
//   const quizDate = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - quizDate.getTime()) / 1000);

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds}s ago`;
//   } else if (diffInSeconds < 3600) {
//     const minutes = Math.floor(diffInSeconds / 60);
//     return `${minutes}m ago`;
//   } else if (diffInSeconds < 86400) {
//     const hours = Math.floor(diffInSeconds / 3600);
//     return `${hours}h ago`;
//   } else if (diffInSeconds < 604800) {
//     const days = Math.floor(diffInSeconds / 86400);
//     return `${days}d ago`;
//   } else {
//     return new Date(dateString).toLocaleDateString();
//   }
// };

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required. Please log in.');
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await apiClient.get(API_ENDPOINTS.GetDashboard, config);
        console.log("Dashboard data:", response.data);
        
        if (response.data && response.data.data) {
          setDashboardData(response.data.data);
        } else {
          throw new Error('Invalid dashboard data received from server');
        }
        
        setError(null);
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 401) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
          } else {
            setError(`Failed to fetch data: ${err.response.data?.message || 'Server error'}`);
          }
        } else if (err.request) {
          setError('Cannot connect to server. Please check your connection.');
        } else {
          setError('Failed to fetch dashboard data. Please try again later.');
        }
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate achievement data from the API response
  const getAchievementData = () => {
    if (!dashboardData || !dashboardData.achievements) return [];
    // Helper to pick icon based on achievement name
    const getIcon = (name: string) => {
      switch (name.toUpperCase()) {
        case 'FIRST STEPS':
          return <Star className="w-5 h-5" />;
        case 'QUIZ APPRENTICE':
          return <BookOpen className="w-5 h-5" />;
        case 'QUIZ MASTER':
          return <Trophy className="w-5 h-5" />;
        case 'PERFECT SCORE':
          return <Target className="w-5 h-5" />;
        case 'HIGH PERFORMER':
          return <TrendingUp className="w-5 h-5" />;
        case 'SUBJECT EXPLORER':
          return <Users className="w-5 h-5" />;
        case 'WEEKLY WARRIOR':
          return <Calendar className="w-5 h-5" />;
        default:
          return <Award className="w-5 h-5" />;
      }
    };

    return dashboardData.achievements.map((achievement) => ({
      id: achievement.name.toLowerCase().replace(/\s/g, ''),
      title: achievement.name.replace(/_/g, ' '),
      description: achievement.description,
      earned: achievement.completed,
      icon: getIcon(achievement.name),
      progress: Math.min(achievement.progress, 100),
      current: achievement.current,
      target: achievement.threshold,
    }));
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

  if (!dashboardData) {
    return null;
  }

  const achievementData = getAchievementData();
  const earnedAchievements = achievementData.filter(a => a.earned).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Average Score" 
          value={`${dashboardData?.averageScore?.toFixed?.(1) ?? 0}%`} 
          icon={<Award className="text-emerald-600" />}
          description="Your overall quiz performance"
          color="bg-emerald-50"
        />
        <StatsCard 
          title="Highest Score" 
          value={`${dashboardData.highestScore}%`} 
          icon={<TrendingUp className="text-blue-600" />}
          description="Your best quiz result"
          color="bg-blue-50"
        />
        <StatsCard 
          title="Completed Videos" 
          value={String(dashboardData.completedVideos)} 
          icon={<Film className="text-purple-600" />}
          description="Videos watched with quizzes"
          color="bg-purple-50"
        />
        <StatsCard 
          title="Total Quizzes" 
          value={String(dashboardData.totalQuizzes)} 
          icon={<CheckCircle className="text-orange-600" />}
          description="Quizzes completed"
          color="bg-orange-50"
        />
      </div>
      
      {/* Achievements Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Achievements
          </h2>
          <span className="text-sm text-gray-500">
            {earnedAchievements} of {achievementData.length} earned
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementData.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border ${achievement.earned ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start mb-2">
                <div className={`p-2 rounded-full mr-3 ${achievement.earned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${achievement.earned ? 'text-amber-700' : 'text-gray-700'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
              {!achievement.earned && (
                <div className="pl-10">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{achievement.current} / {achievement.target}</span>
                    <span>{Math.round(achievement.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {achievement.earned && (
                <div className="pl-10">
                  <div className="flex items-center text-sm text-amber-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="font-medium">Completed!</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" /> Score Distribution
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-600">Low (0-59%)</span>
              <span className="text-sm text-gray-600">{dashboardData?.chartData?.scoreDistribution?.low ?? 0} quizzes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-red-500"
                style={{
                  width: `${dashboardData?.chartData?.scoreDistribution?.low && dashboardData?.totalQuizzes ? (dashboardData.chartData.scoreDistribution.low / dashboardData.totalQuizzes) * 100 : 0}%`
                }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-600">Medium (60-79%)</span>
              <span className="text-sm text-gray-600">{dashboardData?.chartData?.scoreDistribution?.mid ?? 0} quizzes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-yellow-500"
                style={{
                  width: `${dashboardData?.chartData?.scoreDistribution?.mid && dashboardData?.totalQuizzes ? (dashboardData.chartData.scoreDistribution.mid / dashboardData.totalQuizzes) * 100 : 0}%`
                }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">High (80-100%)</span>
              <span className="text-sm text-gray-600">{dashboardData?.chartData?.scoreDistribution?.high ?? 0} quizzes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-green-500"
                style={{
                  width: `${dashboardData?.chartData?.scoreDistribution?.high && dashboardData?.totalQuizzes ? (dashboardData.chartData.scoreDistribution.high / dashboardData.totalQuizzes) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" /> Quizzes by Subject
          </h2>
          <div className="space-y-4">
            {Object.entries(dashboardData?.chartData?.quizzesBySubject ?? {}).map(([subject, count]) => (
              <div key={subject} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{subject === 'undefined' ? 'Unknown Subject' : subject}</h3>
                  <span className="text-sm font-medium text-gray-600">
                    {count} quizzes
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600"
                    style={{ width: `${dashboardData?.totalQuizzes ? (Number(count) / dashboardData.totalQuizzes) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {dashboardData?.totalQuizzes ? Math.round((Number(count) / dashboardData.totalQuizzes) * 100) : 0}% of total quizzes
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" /> Performance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {dashboardData.totalQuizzes}
            </div>
            <div className="text-sm text-gray-600">Total Quizzes Taken</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {dashboardData?.achievements?.find(a => a.name === 'PERFECT SCORE')?.current ?? 0}
            </div>
            <div className="text-sm text-gray-600">Perfect Scores</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {dashboardData?.achievements?.find(a => a.name === 'SUBJECT EXPLORER')?.current ?? 0}
            </div>
            <div className="text-sm text-gray-600">Subjects Explored</div>
          </div>
        </div>
      </div>

      {/* Fun Facts Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" /> Fun Facts & Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.funFacts.map((fact) => (
            <div key={fact.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{fact.icon}</span>
                <div>
                  <p className="text-sm text-gray-700">{fact.text}</p>
                  <span className="text-xs text-gray-500 mt-2 block">{fact.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Stats Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" /> Your Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              Level {dashboardData.userStats.level}
            </div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {dashboardData.userStats.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.floor(dashboardData.userStats.totalTimeSpent / 60)}m
            </div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600 mb-2">
              {dashboardData.userStats.totalPointsEarned}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {dashboardData.userStats.longestStreak}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              {dashboardData.userStats.experience}
            </div>
            <div className="text-sm text-gray-600">Experience Points</div>
          </div>
        </div>
      </div>

      {/* Recent Quiz History */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <History className="w-5 h-5 mr-2" /> Recent Quiz History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Topic</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.recentQuizHistory.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {new Date(quiz.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{quiz.subject}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{quiz.topic}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{quiz.score}%</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{quiz.timeTaken}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart className="w-5 h-5 mr-2" /> Subject Progress
        </h2>
        <div className="space-y-6">
          {dashboardData.subjectProgress.map((subject) => (
            <div key={subject.subjectId} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{subject.subjectName}</h3>
                <div className="text-sm text-gray-500">
                  {Math.floor(subject.totalTimeSpent / 60)} minutes spent
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Quizzes</div>
                  <div className="text-xl font-semibold text-blue-600">{subject.totalQuizzes}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Average Score</div>
                  <div className="text-xl font-semibold text-green-600">{subject.averageScore}%</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Completed Topics</div>
                  <div className="text-xl font-semibold text-purple-600">{subject.completedTopics.length}</div>
                </div>
              </div>
            </div>
          ))}
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

export default Dashboard;
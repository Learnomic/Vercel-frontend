import apiClient from './apiClient';

// Define API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REFRESH_TOKEN: 'refresh-token',
    LOGOUT: 'logout',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
  },
  GetProfile: "user",
  UpdateProfile: "update-profile",
  Register: "auth/register",
  GetAllSubjects: "curriculum/subjects",
  GetCurriculum: "/curriculum/subject/",
  GetQuiz: "quiz?",
  SubmitQuiz: "submit_quiz",
  GetDashboard: "dashboard",
};

// Updated RegisterData interface without school information
interface RegisterData {
  name: string;
  email: string;
  password: string;
  board: string;
  grade: string | number;
}

// Auth services
export const authService = {
  login: (email: string, password: string) => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },
  
  register: (data: RegisterData) => {
    return apiClient.post(API_ENDPOINTS.Register, data);
  },
 
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Clear all tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    
    // Clear any quiz-related session storage
    sessionStorage.removeItem('pendingQuizSubmission');
    sessionStorage.removeItem('quizVideoId');
    
    // Notify other components
    window.dispatchEvent(new Event('logout'));
    
    // Call the logout API endpoint if a refresh token exists
    if (refreshToken) {
      return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    }
    
    // If no refresh token, just return a resolved promise
    return Promise.resolve({ data: { success: true } });
  },
};

// Function to submit quiz with token
export const submitQuiz = (quizData: any) => {
  const token = localStorage.getItem('token');
  return apiClient.post(API_ENDPOINTS.SubmitQuiz, quizData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};



export const GetPlaylistBySubject = async (board: string, grade: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  return await apiClient.get('/playlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      board,
      grade
    }
  });
};

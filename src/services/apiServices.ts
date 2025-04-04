import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import axios from 'axios';

// Define API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'login',
    REFRESH_TOKEN: 'refresh-token',
    LOGOUT: 'logout',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
  },
  GetProfile: "user/profile",
  UpdateProfile: "user/profile",
  Register: "signup",
  GetAllSubjects: "subjects",
  GetPlaylist: "user/playlists",
  GetVideo: "playlist/videos?",
  GenerateQuiz: "/video/complete_quiz",
  StoreVideoProgress: "/video/progress",
  SubmitQuiz: "/submit_quiz",
  GetVideoPregress:"video/progress",
  GetVideoHistory:"video/history",
  GetUserProgress:"user/progress",
  GetAchievements:"user/achievements",
  Language: "/supported_languages",
  Translate: "/translate_quiz"
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
  board: string;
  grade: number;
  school_name: string;
  division: string;
  pin_code: number;
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
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },
};

export const GetAllSubjects = async () => {
  const token = localStorage.getItem('token');
  return apiClient.get(API_ENDPOINTS.GetAllSubjects, {
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

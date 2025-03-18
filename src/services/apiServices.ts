import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

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
  Register: "signup",
  GetAllSubjects: "subjects",
  GetPlaylist: "user/playlists",
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
  board: string;
  grade: number;
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
  return apiClient.post(API_ENDPOINTS.GetAllSubjects, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

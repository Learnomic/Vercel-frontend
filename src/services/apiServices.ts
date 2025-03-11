import apiClient from './apiClient';

// Define API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/signup',
    REFRESH_TOKEN: '/refresh-token',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  }
};

// Auth services
export const authService = {
  login: (email: string, password: string) => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },
  
  register: (name: string, email: string, password: string, grade?: string) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, { name, email, password, grade });
  },
  
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },
};

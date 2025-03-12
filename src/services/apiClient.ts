import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
          refreshToken,
        });
        
        // Update tokens in localStorage
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 
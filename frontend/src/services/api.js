const API_URL = import.meta.env.VITE_API_URL || '/api';

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
        const { data } = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        if (data.success && data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        
        localStorage.removeItem('token');
        
      }
    }
    return Promise.reject(error);
  }
);

export default api;

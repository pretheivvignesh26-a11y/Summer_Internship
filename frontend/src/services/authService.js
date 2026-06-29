import api from './api';

const authService = {
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
    }
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (token, password) => {
    const { data } = await api.put(`/auth/reset-password/${token}`, { password });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/users/profile', profileData);
    return data;
  },

  uploadProfileImage: async (formData) => {
    const { data } = await api.patch('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteAccount: async () => {
    const { data } = await api.delete('/users/profile');
    localStorage.removeItem('token');
    return data;
  },
};

export default authService;

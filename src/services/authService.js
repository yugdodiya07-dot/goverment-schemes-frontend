import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (formData) => {
    // FormData for file upload
    const response = await api.put('/auth/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  forgotPassword: async (data) => {
    const payload = typeof data === 'string' ? { userId: data } : data;
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
  },

  resetPassword: async (tokenOrData, newPassword) => {
    const payload =
      typeof tokenOrData === 'object'
        ? tokenOrData
        : { resetToken: tokenOrData, newPassword };
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },
};

export default authService;

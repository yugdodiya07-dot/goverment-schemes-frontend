import api from './api';

const statsService = {
  getAdminStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },

  getPublicStats: async () => {
    const response = await api.get('/stats/public');
    return response.data;
  },
};

export default statsService;

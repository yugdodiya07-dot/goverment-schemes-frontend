import api from './api';

const schemeService = {
  getAllSchemes: async (params = {}) => {
    const response = await api.get('/schemes', { params });
    return response.data;
  },

  getSchemeById: async (id) => {
    const response = await api.get(`/schemes/${id}`);
    return response.data;
  },

  checkEligibility: async (userProfile = {}) => {
    const response = await api.post('/schemes/check-eligibility', userProfile);
    return response.data;
  },

  toggleBookmark: async (id) => {
    const response = await api.post(`/schemes/${id}/bookmark`);
    return response.data;
  },

  createScheme: async (schemeData) => {
    const response = await api.post('/schemes', schemeData);
    return response.data;
  },

  updateScheme: async (id, schemeData) => {
    const response = await api.put(`/schemes/${id}`, schemeData);
    return response.data;
  },

  deleteScheme: async (id) => {
    const response = await api.delete(`/schemes/${id}`);
    return response.data;
  },
};

export default schemeService;

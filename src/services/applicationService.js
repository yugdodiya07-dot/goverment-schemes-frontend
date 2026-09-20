import api from './api';

const applicationService = {
  submitApplication: async (formData) => {
    // Requires multipart/form-data for document uploads
    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getAllApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  updateApplicationStatus: async (id, status, remarks) => {
    const response = await api.put(`/applications/${id}/status`, { status, remarks });
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationService;

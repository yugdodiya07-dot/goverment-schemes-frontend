import api from './api';

const contactService = {
  sendMessage: async (data) => {
    const res = await api.post('/contact', data);
    return res.data;
  },

  getAllMessages: async () => {
    const res = await api.get('/contact');
    return res.data;
  },
};

export default contactService;

import apiClient from './client';

const especeService = {
  getAll: async () => {
    const response = await apiClient.get('/api/espece/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/espece/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/espece/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/espece/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/espece/${id}/`);
    return response.data;
  },
};

export default especeService;




















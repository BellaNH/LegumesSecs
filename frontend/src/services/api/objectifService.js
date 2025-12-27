import apiClient from './client';

const objectifService = {
  getAll: async () => {
    const response = await apiClient.get('/api/objectif/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/objectif/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/objectif/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/objectif/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id, data) => {
    const response = await apiClient.patch(`/api/objectif/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/objectif/${id}/`);
    return response.data;
  },
};

export default objectifService;






















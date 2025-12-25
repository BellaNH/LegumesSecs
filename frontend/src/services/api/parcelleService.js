import apiClient from './client';

const parcelleService = {
  getAll: async () => {
    const response = await apiClient.get('/api/parcelle/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/parcelle/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/parcelle/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/parcelle/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id, data) => {
    const response = await apiClient.patch(`/api/parcelle/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/parcelle/${id}/`);
    return response.data;
  },
};

export default parcelleService;


















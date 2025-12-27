import apiClient from './client';

const agriculteurService = {
  getAll: async () => {
    const response = await apiClient.get('/api/agriculteur/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/agriculteur/${id}/`);
    return response.data;
  },

  getFiltered: async (filters = {}) => {
    const params = {};
    if (filters.wilaya) params.wilaya = filters.wilaya;
    if (filters.subdivision) params.subdivision = filters.subdivision;
    if (filters.commune) params.commune = filters.commune;

    const response = await apiClient.get('/api/agriculteur-filter/', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/agriculteur/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/agriculteur/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id, data) => {
    const response = await apiClient.patch(`/api/agriculteur/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/agriculteur/${id}/`);
    return response.data;
  },
};

export default agriculteurService;






















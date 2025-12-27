import apiClient from './client';

const userService = {
  getAll: async () => {
    const response = await apiClient.get('/api/user/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/user/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/api/user/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/user/${id}/`, data);
    return response.data;
  },

  partialUpdate: async (id, data) => {
    const response = await apiClient.patch(`/api/user/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/user/${id}/`);
    return response.data;
  },
};

export default userService;





















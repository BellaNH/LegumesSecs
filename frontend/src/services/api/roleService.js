import apiClient from './client';

const roleService = {
  getAll: async () => {
    const response = await apiClient.get('/api/role');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/role/${id}/`);
    return response.data;
  },
};

export default roleService;


















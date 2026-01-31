import apiClient from './client';

const objectifService = {
  getAll: async () => {
    const all = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const response = await apiClient.get('/api/objectif/', { params: { page } });
      const data = response.data;
      const results = Array.isArray(data) ? data : (data?.results || []);
      all.push(...results);
      hasMore = !!data?.next;
      page += 1;
    }
    return all;
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























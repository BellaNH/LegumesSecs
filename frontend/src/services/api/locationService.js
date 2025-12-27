import apiClient from './client';

const locationService = {
  getWilayas: async () => {
    const response = await apiClient.get('/api/wilaya/');
    return response.data;
  },

  getSubdivisions: async () => {
    const response = await apiClient.get('/api/subdivision/');
    return response.data;
  },

  getSubdivisionsByWilaya: async (wilayaId) => {
    const response = await apiClient.get('/api/filterSubdivBywilaya/', {
      params: { wilaya: wilayaId },
    });
    return response.data;
  },

  getCommunes: async () => {
    const response = await apiClient.get('/api/commune/');
    return response.data;
  },

  getCommunesByWilaya: async (wilayaId) => {
    const response = await apiClient.get('/api/filterCommuneBywilaya/', {
      params: { wilaya: wilayaId },
    });
    return response.data;
  },

  getCommunesBySubdivision: async (subdivisionId) => {
    const response = await apiClient.get('/api/filterCommuneBySubdiv/', {
      params: { subdivision: subdivisionId },
    });
    return response.data;
  },
};

export default locationService;























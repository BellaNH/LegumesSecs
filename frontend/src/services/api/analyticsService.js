import apiClient from './client';

const analyticsService = {
  getActiveAgriculteursThisYear: async () => {
    const response = await apiClient.get('/api/active_this_year/');
    return response.data;
  },

  getSuperficieEspeceComparison: async () => {
    const response = await apiClient.get('/api/superficie_espece_comparaision/');
    return response.data;
  },

  getYearlyProduction: async () => {
    const response = await apiClient.get('/api/yearly_production/');
    return response.data;
  },

  getSupLabSiniProduction: async () => {
    const response = await apiClient.get('/api/sup_lab_sin_prod/');
    return response.data;
  },

  getPrevProductionVsProduction: async () => {
    const response = await apiClient.get('/api/prev_vs_prod/');
    return response.data;
  },

  getTopWilayas: async () => {
    const response = await apiClient.get('/api/top_wilayas/');
    return response.data;
  },
};

export default analyticsService;




















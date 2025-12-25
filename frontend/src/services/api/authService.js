import apiClient from './client';

const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/token/', {
      email,
      password,
    });
    return response.data;
  },

  logout: async (refreshToken) => {
    try {
      await apiClient.post('/api/logout/', {
        refresh_token: refreshToken,
      });
    } catch (error) {
      // Continue with logout even if API call fails
    }
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/api/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/me/');
    return response.data;
  },

  resetPassword: async (email, newPassword) => {
    const response = await apiClient.post('/api/reset-password/', {
      email,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default authService;



















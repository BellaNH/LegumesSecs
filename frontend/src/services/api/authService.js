import apiClient from './client';

const authService = {
  register: async ({ email, password, fullName }) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      fullName,
    });
    return response.data.data;
  },

  verifyEmail: async (token) => {
    await apiClient.post('/auth/verify-email', { token });
  },

  resendVerificationEmail: async (email) => {
    await apiClient.post('/auth/resend-verification-email', { email });
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },

  refreshSession: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue with local logout even if API call fails
    }
  },

  forgotPassword: async (email) => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    await apiClient.post('/auth/reset-password', { token, password });
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/me/');
    return response.data;
  },
};

export default authService;

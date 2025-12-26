import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://legumessecs.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshTokenCallback = null;
let logoutCallback = null;

export const setupApiClient = (refreshTokenFn, logoutFn) => {
  refreshTokenCallback = refreshTokenFn;
  logoutCallback = logoutFn;

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          if (refreshTokenCallback) {
            const newToken = await refreshTokenCallback();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshError) {
          if (logoutCallback) {
            logoutCallback();
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;




















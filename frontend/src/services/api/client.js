import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStorage';

const AUTH_PATHS_WITHOUT_REFRESH = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/auth/verify-email',
  '/auth/resend-verification-email',
  '/auth/forgot-password',
  '/auth/reset-password',
]);

const shouldSkipTokenRefresh = (url) => {
  if (!url) return false;
  try {
    const path = url.startsWith('http') ? new URL(url).pathname : url;
    return AUTH_PATHS_WITHOUT_REFRESH.has(path);
  } catch {
    return AUTH_PATHS_WITHOUT_REFRESH.has(url);
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let logoutCallback = null;
let refreshPromise = null;

export const setupApiClient = (_refreshTokenFn, logoutFn) => {
  logoutCallback = logoutFn;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isUnauthorized = status === 401;
    const skipRefresh = shouldSkipTokenRefresh(originalRequest?.url);
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (!originalRequest || !isUnauthorized || originalRequest._retry || isRefreshRequest || skipRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = apiClient.post('/auth/refresh').then((response) => {
          const accessToken = response.data?.data?.accessToken;
          if (!accessToken) {
            throw new Error('Missing access token');
          }
          setAccessToken(accessToken);
          return accessToken;
        });
      }

      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      if (logoutCallback) {
        logoutCallback();
      }
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);

export default apiClient;

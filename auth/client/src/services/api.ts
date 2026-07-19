import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { clearAccessToken, getAccessToken, setAccessToken } from "./token-storage";
import type { ApiSuccess, AuthSession } from "../types/auth";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const AUTH_PATHS_WITHOUT_REFRESH = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/verify-email",
  "/auth/resend-verification-email",
  "/auth/forgot-password",
  "/auth/reset-password",
]);

const shouldSkipTokenRefresh = (url: string | undefined) => {
  if (!url) {
    return false;
  }

  return AUTH_PATHS_WITHOUT_REFRESH.has(url);
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url === "/auth/refresh";
    const skipRefresh = shouldSkipTokenRefresh(originalRequest?.url);

    if (!originalRequest || !isUnauthorized || originalRequest._retry || isRefreshRequest || skipRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await api.post<ApiSuccess<AuthSession>>("/auth/refresh");
      setAccessToken(response.data.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);

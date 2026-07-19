import { api } from "./api";
import type { ApiSuccess, AuthSession, AuthUser } from "../types/auth";

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const registerRequest = async (body: RegisterRequest) => {
  const response = await api.post<ApiSuccess<{ user: AuthUser }>>("/auth/register", body);
  return response.data.data;
};

export const verifyEmailRequest = async (token: string) => {
  await api.post("/auth/verify-email", { token });
};

export const resendVerificationEmailRequest = async (email: string) => {
  await api.post("/auth/resend-verification-email", { email });
};

export const loginRequest = async (body: LoginRequest) => {
  const response = await api.post<ApiSuccess<AuthSession>>("/auth/login", body);
  return response.data.data;
};

export const refreshSessionRequest = async () => {
  const response = await api.post<ApiSuccess<AuthSession>>("/auth/refresh");
  return response.data.data;
};

export const logoutRequest = async () => {
  await api.post("/auth/logout");
};

export const forgotPasswordRequest = async (email: string) => {
  await api.post("/auth/forgot-password", { email });
};

export const resetPasswordRequest = async (token: string, password: string) => {
  await api.post("/auth/reset-password", { token, password });
};

export const getCurrentUserRequest = async () => {
  const response = await api.get<ApiSuccess<{ user: AuthUser }>>("/auth/me");
  return response.data.data.user;
};

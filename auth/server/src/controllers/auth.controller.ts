import type { CookieOptions, RequestHandler } from "express";

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendVerificationEmailInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../schemas/auth.schemas.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from "../services/auth.service.js";
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_TTL_DAYS } from "../services/token.service.js";

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "lax",
  path: "/auth",
  maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

export const register: RequestHandler = async (req, res) => {
  const user = await registerUser(req.body as RegisterInput);

  res.status(201).json({
    success: true,
    data: { user },
  });
};

export const verifyEmailAddress: RequestHandler = async (req, res) => {
  await verifyEmail(req.body as VerifyEmailInput);

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
};

export const resendVerificationEmailAddress: RequestHandler = async (req, res) => {
  await resendVerificationEmail(req.body as ResendVerificationEmailInput);

  res.status(200).json({
    success: true,
    message: "If the account exists and is not verified, a new verification email has been sent.",
  });
};

export const login: RequestHandler = async (req, res) => {
  const { refreshToken, ...data } = await loginUser(req.body as LoginInput);

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    data,
  });
};

export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken, ...data } = await refreshSession(
    req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined,
  );

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    data,
  });
};

export const logout: RequestHandler = async (req, res) => {
  await logoutUser(req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined);

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...refreshCookieOptions,
    maxAge: undefined,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

export const forgotPassword: RequestHandler = async (req, res) => {
  await requestPasswordReset(req.body as ForgotPasswordInput);

  res.status(200).json({
    success: true,
    message: "A reset link was sent to your email.",
  });
};

export const resetUserPassword: RequestHandler = async (req, res) => {
  await resetPassword(req.body as ResetPasswordInput);

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...refreshCookieOptions,
    maxAge: undefined,
  });

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
};

export const me: RequestHandler = async (req, res) => {
  const user = await getCurrentUser(req.user!.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

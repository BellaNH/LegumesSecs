import { z } from "zod";

const email = z.email().trim().toLowerCase();

const password = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72, "Password must be 72 characters or fewer.");

export const registerSchema = z.object({
  email,
  password,
  fullName: z.string().trim().min(2).max(80),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(32, "Verification token is invalid."),
});

export const resendVerificationEmailSchema = z.object({
  email,
});

export const forgotPasswordSchema = z.object({
  email,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, "Reset token is invalid."),
  password,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationEmailInput = z.infer<typeof resendVerificationEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

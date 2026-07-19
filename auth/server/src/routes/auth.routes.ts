import { Router } from "express";

import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resendVerificationEmailAddress,
  resetUserPassword,
  verifyEmailAddress,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schemas/auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), register);
authRouter.post("/verify-email", validate({ body: verifyEmailSchema }), verifyEmailAddress);
authRouter.post(
  "/resend-verification-email",
  validate({ body: resendVerificationEmailSchema }),
  resendVerificationEmailAddress,
);
authRouter.post("/login", validate({ body: loginSchema }), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword);
authRouter.post("/reset-password", validate({ body: resetPasswordSchema }), resetUserPassword);
authRouter.get("/me", authenticateToken, me);

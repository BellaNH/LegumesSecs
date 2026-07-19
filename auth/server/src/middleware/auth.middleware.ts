import type { RequestHandler } from "express";

import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../services/token.service.js";
import { AppError } from "./error.middleware.js";

export const authenticateToken: RequestHandler = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AppError("Access token is required.", 401, "ACCESS_TOKEN_REQUIRED");
  }

  const payload = verifyAccessToken(token);

  const user = await prisma.user.findFirst({
    where: {
      id: payload.sub,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new AppError("Authenticated user no longer exists.", 401, "USER_NOT_FOUND");
  }

  if (!user.emailVerified) {
    throw new AppError("Email verification is required.", 403, "EMAIL_NOT_VERIFIED");
  }

  req.user = {
    id: user.id,
    email: user.email,
  };

  next();
};

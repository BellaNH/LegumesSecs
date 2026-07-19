import crypto from "node:crypto";

import jsonwebtoken from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

import { AppError } from "../middleware/error.middleware.js";

const ACCESS_TOKEN_EXPIRES_IN = (process.env["JWT_ACCESS_EXPIRES_IN"] ??
  "1h") as NonNullable<SignOptions["expiresIn"]>;
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
export const REFRESH_TOKEN_TTL_DAYS = 7;

type AccessTokenPayload = {
  sub: string;
  email: string;
};

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} must be set.`);
  }

  return value;
};

export const createSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const addMinutes = (minutes: number) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const addDays = (days: number) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export const createAccessToken = (payload: AccessTokenPayload) => {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  };

  return jsonwebtoken.sign(payload, getRequiredEnv("JWT_ACCESS_SECRET"), options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const payload = jsonwebtoken.verify(token, getRequiredEnv("JWT_ACCESS_SECRET"));

    if (!isAccessTokenPayload(payload)) {
      throw new AppError("Access token payload is invalid.", 401, "INVALID_ACCESS_TOKEN");
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Access token is invalid or expired.", 401, "INVALID_ACCESS_TOKEN");
  }
};

const isAccessTokenPayload = (payload: string | JwtPayload): payload is AccessTokenPayload => {
  return (
    typeof payload !== "string" &&
    typeof payload.sub === "string" &&
    typeof payload.email === "string"
  );
};

import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.middleware.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendVerificationEmailInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../schemas/auth.schemas.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service.js";
import {
  REFRESH_TOKEN_TTL_DAYS,
  addDays,
  addMinutes,
  createAccessToken,
  createSecureToken,
  hashToken,
} from "./token.service.js";

const EMAIL_VERIFICATION_TTL_HOURS = 24;
const PASSWORD_RESET_TTL_MINUTES = 30;
const BCRYPT_ROUNDS = 12;

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser && !existingUser.deletedAt) {
    throw new AppError("An account with this email already exists.", 409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const verificationToken = createSecureToken();
  const verificationTokenHash = hashToken(verificationToken);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
      },
      select: publicUserSelect,
    });

    await tx.emailVerificationToken.create({
      data: {
        userId: createdUser.id,
        tokenHash: verificationTokenHash,
        expiresAt: addDays(EMAIL_VERIFICATION_TTL_HOURS / 24),
      },
    });

    return createdUser;
  });

  await sendVerificationEmail(user.email, verificationToken);

  return user;
};

export const verifyEmail = async (input: VerifyEmailInput) => {
  const tokenHash = hashToken(input.token);

  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !verificationToken ||
    verificationToken.used ||
    verificationToken.expiresAt < new Date() ||
    verificationToken.user.deletedAt
  ) {
    throw new AppError("Verification token is invalid or expired.", 400, "INVALID_VERIFICATION_TOKEN");
  }

  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    }),
  ]);
};

export const resendVerificationEmail = async (input: ResendVerificationEmailInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || user.deletedAt || user.emailVerified) {
    return;
  }

  const verificationToken = createSecureToken();
  const verificationTokenHash = hashToken(verificationToken);

  await prisma.$transaction([
    prisma.emailVerificationToken.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    }),
    prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: verificationTokenHash,
        expiresAt: addDays(EMAIL_VERIFICATION_TTL_HOURS / 24),
      },
    }),
  ]);

  await sendVerificationEmail(user.email, verificationToken);
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || user.deletedAt) {
    throw new AppError("No account found with this email.", 401, "USER_NOT_FOUND");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("The email or password you entered is incorrect.", 401, "INVALID_CREDENTIALS");
  }

  if (!user.emailVerified) {
    throw new AppError("Please verify your email before logging in.", 403, "EMAIL_NOT_VERIFIED");
  }

  const tokens = await issueSession(user.id, user.email);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
};

export const refreshSession = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is missing.", 401, "REFRESH_TOKEN_MISSING");
  }

  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt < new Date() ||
    storedToken.user.deletedAt
  ) {
    throw new AppError("Refresh token is invalid or expired.", 401, "INVALID_REFRESH_TOKEN");
  }

  const nextRefreshToken = createSecureToken();
  const nextRefreshTokenHash = hashToken(nextRefreshToken);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    }),
    prisma.refreshToken.create({
      data: {
        userId: storedToken.userId,
        tokenHash: nextRefreshTokenHash,
        expiresAt: addDays(REFRESH_TOKEN_TTL_DAYS),
      },
    }),
  ]);

  return {
    user: toPublicUser(storedToken.user),
    accessToken: createAccessToken({
      sub: storedToken.user.id,
      email: storedToken.user.email,
    }),
    refreshToken: nextRefreshToken,
  };
};

export const logoutUser = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    return;
  }

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(refreshToken),
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });
};

export const requestPasswordReset = async (input: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || user.deletedAt) {
    return;
  }

  const resetToken = createSecureToken();

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(resetToken),
      expiresAt: addMinutes(PASSWORD_RESET_TTL_MINUTES),
    },
  });

  await sendPasswordResetEmail(user.email, resetToken);
};

export const resetPassword = async (input: ResetPasswordInput) => {
  const tokenHash = hashToken(input.token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !resetToken ||
    resetToken.used ||
    resetToken.expiresAt < new Date() ||
    resetToken.user.deletedAt
  ) {
    throw new AppError("Password reset token is invalid or expired.", 400, "INVALID_RESET_TOKEN");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.refreshToken.updateMany({
      where: {
        userId: resetToken.userId,
        revoked: false,
      },
      data: { revoked: true },
    }),
  ]);
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }

  return user;
};

const issueSession = async (userId: string, email: string) => {
  const refreshToken = createSecureToken();

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: addDays(REFRESH_TOKEN_TTL_DAYS),
    },
  });

  return {
    accessToken: createAccessToken({ sub: userId, email }),
    refreshToken,
  };
};

const publicUserSelect = {
  id: true,
  email: true,
  fullName: true,
  avatarUrl: true,
  emailVerified: true,
  createdAt: true,
} as const;

const toPublicUser = (user: {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: Date;
}) => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
};

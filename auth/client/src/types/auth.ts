export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    issues?: unknown;
  };
};

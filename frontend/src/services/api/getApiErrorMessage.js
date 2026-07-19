const USER_FRIENDLY_ERROR_MESSAGES = {
  USER_NOT_FOUND: 'No account found with this email.',
  INVALID_CREDENTIALS: 'The email or password you entered is incorrect.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  INVALID_VERIFICATION_TOKEN: 'Verification token is invalid or expired.',
  INVALID_RESET_TOKEN: 'Password reset token is invalid or expired.',
  REFRESH_TOKEN_MISSING: 'Your session has expired. Please log in again.',
  INVALID_REFRESH_TOKEN: 'Your session has expired. Please log in again.',
  ACCESS_TOKEN_REQUIRED: 'Your session has expired. Please log in again.',
  INVALID_ACCESS_TOKEN: 'Your session has expired. Please log in again.',
};

export const getApiErrorMessage = (error, fallback) => {
  const errorCode = error?.response?.data?.error?.code;
  const serverMessage = error?.response?.data?.error?.message;

  if (errorCode && USER_FRIENDLY_ERROR_MESSAGES[errorCode]) {
    return USER_FRIENDLY_ERROR_MESSAGES[errorCode];
  }

  return (
    serverMessage ||
    error?.response?.data?.detail ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

export default getApiErrorMessage;

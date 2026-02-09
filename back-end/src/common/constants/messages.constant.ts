export const AUTH_MESSAGES = {
  // success
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS:
    'OTP sent to your email. Please verify to complete registration.',
  EMAIL_VERIFIED: 'Email verified successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  GOOGLE_LOGIN_SUCCESS: 'Google login successful',

  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_EMAIL: 'Invalid email',
  INVALID_PASSWORD: 'Invalid password',
  EMAIL_ALREADY_REGISTERED: 'Email already registered',
  EMAIL_NOT_VERIFIED: 'Please verify your email',
  ACCOUNT_BLOCKED: 'Your account has been blocked by admin',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_REQUEST: 'invalid request',
  INVALID_TOKEN: 'invalid token',
  USER_NOT_AUTHORIZED: 'User not authorized',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_NOT_MATCH: 'password do not match',
  PASSWORD_RESET_FAILED: 'Failed to reset password',
  REGISTRATION_EXPIRED: 'Registration expired',
};

export const USER_MESSAGES = {
  BLOCKED: 'User blocked successfully',
  UNBLOCKED: 'User unblocked successfully',
  FETCHED: 'Users fetched successfully',
  NOT_FOUND: 'User not found',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  AVATAR_UPLOADED: 'Avatar uploaded successfully',
};

export const ADMIN_MESSAGES = {
  LOGIN_SUCCESS: 'Admin login successful',
  LOGOUT_SUCCESS: 'Admin logout successful',
  INVALID_CREDENTIALS: 'Invalid admin credentials',
};

export const OTP_MESSAGES = {
  SENT: 'OTP sent successfully',
  VERIFIED: 'OTP verified successfully',
  RESENT: 'OTP resent successfully',

  FAILED_TO_GENERATE: 'Failed to generate OTP',
  REGISTRATION_EXPIRED: 'Registration expired',
  USER_NOT_FOUND: 'User not found',
};

export const GENERAL_MESSAGES = {
  SUCCESS: 'Operation successful',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Conflict occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  FILE_REQUIRED: 'File is required',
};

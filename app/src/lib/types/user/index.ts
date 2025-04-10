/**
 * User role in the system
 */
export type UserRole = 'user' | 'artist' | 'admin';

/**
 * User profile information
 */
export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole | string;
  emailVerified: boolean;
  walletAddress?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Login credentials for email/password login
 */
export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data for new users
 */
export interface RegistrationData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
  acceptTerms: boolean;
}

/**
 * Password reset request data
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset completion data
 */
export interface PasswordResetCompletion {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Wallet connection request
 */
export interface WalletConnectionRequest {
  walletAddress: string;
  nonce: string;
  signature: string;
}

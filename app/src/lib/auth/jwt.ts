import * as jose from 'jose';
import type { User } from '$lib/types/user';

/**
 * JWT structure for the application
 */
export interface JwtPayload {
  sub: string;         // User ID
  email: string;       // User email
  username: string;    // Username
  role: string;        // User role (user, artist, admin)
  email_verified: boolean; // Email verification status
  wallet_address?: string; // Optional wallet address
  exp: number;         // Expiration timestamp
  iat: number;         // Issued at timestamp
}

/**
 * Decodes a JWT token and returns its payload
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if the token is invalid
 */
export async function decodeJwt(token: string): Promise<JwtPayload | null> {
  try {
    // This is a simple decode without verification since we're client-side
    const decoded = jose.decodeJwt(token);
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Validates a JWT token by checking its expiration
 * @param token - The JWT token to validate
 * @returns True if the token is valid, false otherwise
 */
export async function validateJwt(token: string): Promise<boolean> {
  try {
    const payload = await decodeJwt(token);
    
    if (!payload) return false;
    
    // Check if the token has expired
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    console.error('Error validating JWT:', error);
    return false;
  }
}

/**
 * Extracts user profile information from JWT payload
 * @param payload - The JWT payload
 * @returns The user profile information
 */
export function extractUserFromJwt(payload: JwtPayload): User {
  return {
    id: payload.sub,
    email: payload.email,
    username: payload.username,
    role: payload.role,
    emailVerified: payload.email_verified,
    walletAddress: payload.wallet_address,
  };
}

/**
 * Gets the remaining time in milliseconds until token expiration
 * @param token - The JWT token
 * @returns The remaining time in milliseconds, or 0 if expired/invalid
 */
export async function getTokenRemainingTime(token: string): Promise<number> {
  try {
    const payload = await decodeJwt(token);
    
    if (!payload) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = Math.max(0, payload.exp - now);
    
    return remainingSeconds * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error calculating token remaining time:', error);
    return 0;
  }
}

/**
 * Checks if token needs refresh (less than 15 minutes remaining)
 * @param token - The JWT token
 * @returns True if token needs refresh, false otherwise
 */
export async function tokenNeedsRefresh(token: string): Promise<boolean> {
  const remainingMs = await getTokenRemainingTime(token);
  const fifteenMinutesMs = 15 * 60 * 1000;
  
  return remainingMs < fifteenMinutesMs && remainingMs > 0;
}

/**
 * Gets the JWT token from the cookie
 * @returns The JWT token or null if not found
 */
export function getAuthCookie(): string | null {
  // Only run in browser environment
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    
    if (name === 'auth_token') {
      return value;
    }
  }
  
  return null;
}

/**
 * Sets a JWT token in a secure HTTP-only cookie
 * Note: This is primarily for development as HTTP-only cookies
 * should be set from the server in production
 * @param token - The JWT token to store
 */
export function setAuthCookie(token: string): void {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // For development, use a regular cookie that expires in 24 hours
  const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const expirationDate = new Date(Date.now() + expiresIn);
  
  document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  
  // Note: In production, you would set this cookie from the server with HttpOnly and Secure flags
}

/**
 * Removes the authentication cookie
 */
export function removeAuthCookie(): void {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
}

/**
 * Refreshes the JWT token if needed
 * @returns True if token was refreshed, false otherwise
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  const token = getAuthCookie();
  
  if (!token) return false;
  
  if (await tokenNeedsRefresh(token)) {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        // The server will set the new cookie with HttpOnly flag
        return true;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }
  
  return false;
}

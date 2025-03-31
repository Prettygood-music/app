// Authentication store using Svelte 5 runes
import { 
  decodeJwt, 
  extractUserFromJwt, 
  getAuthCookie, 
  removeAuthCookie, 
  setAuthCookie, 
  validateJwt,
  refreshTokenIfNeeded
} from '$lib/auth/jwt';

/**
 * Authentication store that manages authentication state
 */
function createAuthStore() {
  // Core authentication state
  let authState = $state({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  // Initialize the auth store by checking for an existing token
  async function initialize() {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const token = getAuthCookie();
      
      if (token) {
        const isValid = await validateJwt(token);
        
        if (isValid) {
          const payload = await decodeJwt(token);
          
          if (payload) {
            authState.user = extractUserFromJwt(payload);
            authState.isAuthenticated = true;
            
            // Schedule token refresh check
            const remainingTime = payload.exp * 1000 - Date.now();
            const refreshTime = Math.max(0, remainingTime - (15 * 60 * 1000)); // 15 min before expiry
            
            setTimeout(() => {
              refreshTokenIfNeeded();
            }, refreshTime);
          }
        } else {
          // Token is invalid or expired
          logout();
        }
      } else {
        // No token found
        authState.isAuthenticated = false;
        authState.user = null;
      }
    } catch (error) {
      console.error('Error initializing auth store:', error);
      authState.error = 'Error initializing authentication';
      authState.isAuthenticated = false;
      authState.user = null;
    } finally {
      authState.isLoading = false;
    }
  }

  // Login with email and password
  async function loginWithEmail(emailOrUsername, password, rememberMe = false) {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password, rememberMe }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const { token, user } = await response.json();
      
      // Store token in cookie
      setAuthCookie(token);
      
      // Update auth state
      authState.isAuthenticated = true;
      authState.user = user;
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      authState.error = error.message || 'Login failed';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Register with email
  async function registerWithEmail(registerData) {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      authState.error = error.message || 'Registration failed';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Connect wallet
  async function connectWallet(walletAddress) {
    if (!authState.isAuthenticated) {
      throw new Error('Must be authenticated to connect wallet');
    }
    
    authState.isLoading = true;
    authState.error = null;
    
    try {
      // 1. Get nonce from server
      const nonceResponse = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
      
      if (!nonceResponse.ok) {
        const errorData = await nonceResponse.json();
        throw new Error(errorData.message || 'Failed to get nonce');
      }
      
      const { nonce } = await nonceResponse.json();
      
      // 2. Sign message with wallet (this would need to be implemented with a wallet provider)
      // This is a placeholder for the actual wallet signature process
      const signature = await signMessage(nonce, walletAddress);
      
      // 3. Verify signature with server
      const verifyResponse = await fetch('/api/auth/verify-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, nonce, signature }),
      });
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Wallet verification failed');
      }
      
      const { token, user } = await verifyResponse.json();
      
      // Update token and user data
      setAuthCookie(token);
      authState.user = user;
      
      return user;
    } catch (error) {
      console.error('Wallet connection error:', error);
      authState.error = error.message || 'Failed to connect wallet';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Placeholder for message signing with wallet
  async function signMessage(message, walletAddress) {
    // This would be replaced with actual wallet integration code
    console.warn('Message signing not implemented');
    return 'dummy-signature';
  }

  // Logout
  function logout() {
    // Clear token
    removeAuthCookie();
    
    // Reset auth state
    authState.isAuthenticated = false;
    authState.user = null;
    authState.error = null;
    
    // Redirect to home page (this should be done by the calling component)
  }

  // Request password reset
  async function requestPasswordReset(email) {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to request password reset');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Password reset request error:', error);
      authState.error = error.message || 'Failed to request password reset';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Complete password reset
  async function resetPassword(token, newPassword) {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      authState.error = error.message || 'Failed to reset password';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Resend verification email
  async function resendVerificationEmail(email) {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend verification email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Resend verification error:', error);
      authState.error = error.message || 'Failed to resend verification email';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Verify email
  async function verifyEmail(token) {
    authState.isLoading = true;
    authState.error = null;
    
    try {
      const response = await fetch(`/api/auth/verify-email/${token}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify email');
      }
      
      // If the user is logged in, update their profile
      if (authState.isAuthenticated && authState.user) {
        authState.user = {
          ...authState.user,
          emailVerified: true
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Email verification error:', error);
      authState.error = error.message || 'Failed to verify email';
      throw error;
    } finally {
      authState.isLoading = false;
    }
  }

  // Check if user has a specific role
  function hasRole(role) {
    return authState.isAuthenticated && authState.user?.role === role;
  }

  // Check if user is admin
  const isAdmin = $derived(hasRole('admin'));
  
  // Check if user is artist
  const isArtist = $derived(hasRole('artist'));
  
  // Check if email is verified
  const isEmailVerified = $derived(
    authState.isAuthenticated && authState.user?.emailVerified === true
  );
  
  // Check if wallet is connected
  const isWalletConnected = $derived(
    authState.isAuthenticated && 
    authState.user?.walletAddress !== undefined && 
    authState.user?.walletAddress !== null
  );

  // Initialize on module load
  initialize();

  return {
    // State
    get state() { return authState; },
    get user() { return authState.user; },
    get isAuthenticated() { return authState.isAuthenticated; },
    get isLoading() { return authState.isLoading; },
    get error() { return authState.error; },
    
    // Derived properties
    get isAdmin() { return isAdmin; },
    get isArtist() { return isArtist; },
    get isEmailVerified() { return isEmailVerified; },
    get isWalletConnected() { return isWalletConnected; },
    
    // Methods
    initialize,
    loginWithEmail,
    registerWithEmail,
    connectWallet,
    logout,
    requestPasswordReset,
    resetPassword,
    resendVerificationEmail,
    verifyEmail,
    hasRole
  };
}

// Export a singleton instance
export const authStore = createAuthStore();

import { refreshTokenIfNeeded } from '$lib/auth/jwt';
import type { HandleClientError } from '@sveltejs/kit';
/*
// Schedule token refresh check on initial load
if (typeof window !== 'undefined') {
  // Wait for the document to be fully loaded
  window.addEventListener('load', async () => {
    try {
      // Initial token refresh check
      await refreshTokenIfNeeded();
      
      // Set up a periodic check every 5 minutes
      setInterval(async () => {
        await refreshTokenIfNeeded();
      }, 5 * 60 * 1000); // 5 minutes
    } catch (error) {
      console.error('Error in token refresh setup:', error);
    }
  });
}*/

// Handle client errors, including authentication failures
export const handleError: HandleClientError = async ({ error, event }) => {
	// Check if error is related to authentication
	const errorMessage = error instanceof Error ? error.message : String(error);

	// For other errors, provide a generic message
	return {
		message: 'An unexpected error occurred'
	};
};

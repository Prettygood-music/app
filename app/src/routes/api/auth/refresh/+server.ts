import { databaseClient } from '$lib/databaseClient';
import { json, error } from '@sveltejs/kit';

/**
 * Handles JWT token refresh requests
 * This endpoint extends the user's session by generating a new JWT
 */
export async function POST({ cookies, locals }) {
	// Check if user is authenticated
	if (!locals.user || !locals.token) {
    console.log("no locals")
		throw error(401, { message: 'Authentication required' });
	}

	try {
		// Call the refresh_token RPC function to get a new token
		const { data, error: refreshError } = await databaseClient.rpc("refresh_token", {
			current_token: locals.token,
		});

		if (refreshError) {
      console.error(refreshError)
			throw error(401, { message: 'Failed to refresh token' });
		}

		// Extract the new token
		const newToken = data;

		// Get rememberMe setting from existing cookie (if available)
		// This preserves the user's preference for session length
		const existingCookie = cookies.get('auth_token');
		const isLongSession = existingCookie && cookies.get('remember_me') === 'true';

		// Set the cookie with the new token
		const cookieOptions = {
			httpOnly: true,
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: isLongSession ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 24 hours
		};

		cookies.set('auth_token', newToken, cookieOptions);

		return json({
			success: true,
			message: 'Token refreshed successfully'
		});
	} catch (err) {
		console.error('Token refresh error:', err);

		// Clear the invalid token
		cookies.delete('auth_token', { path: '/' });

		throw error(401, { message: 'Authentication failed' });
	}
}

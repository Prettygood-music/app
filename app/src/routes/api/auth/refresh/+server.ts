import { databaseClient } from '$lib/databaseClient';
import { json, error } from '@sveltejs/kit';
import { decodeJwt } from '$lib/auth/jwt';

/**
 * Handles JWT token refresh requests
 * This endpoint extends the user's session by generating a new JWT
 */
export async function POST({ cookies, locals }) {
	// Check if user is authenticated
	if (!locals.user || !locals.token) {
		console.log('No user or token in locals');
		throw error(401, { message: 'Authentication required' });
	}

	// Debug output - log token info (be careful not to log entire token in production)
	console.log('Attempting to refresh token');
	console.log('User ID:', locals.user.id);
	console.log('Token present:', !!locals.token);

	// Log decoded token info for debugging
	try {
		const decodedToken = await decodeJwt(locals.token);
		console.log('Decoded token sub:', decodedToken?.sub);
		console.log(
			'Token exp:',
			decodedToken?.exp ? new Date(decodedToken.exp * 1000).toISOString() : 'N/A'
		);
	} catch (decodeErr) {
		console.error('Token decode error:', decodeErr);
	}

	try {
		// Call the refresh_token RPC function to get a new token
		console.log(`Calling refresh_token RPC with ${locals.token}...`);
		let { data, error: refreshError } = await databaseClient.rpc('refresh_token', {
			current_token: locals.token
		});

		// If the regular refresh function fails, try the v2 as fallback
		if (refreshError) {
			console.error('Regular refresh_token error:', refreshError);
			console.log('Trying refresh_token_v2 as fallback...');

			const v2Result = await databaseClient.rpc('refresh_token_v2', {
				current_token: locals.token
			});

			data = v2Result.data;
			refreshError = v2Result.error;

			if (!refreshError) {
				console.log('refresh_token_v2 succeeded where regular refresh_token failed');
			} else {
				// If v2 also fails, try the robust version as final fallback
				console.error('refresh_token_v2 error:', refreshError);
				console.log('Trying refresh_token_robust as final fallback...');

				const robustResult = await databaseClient.rpc('refresh_token_robust', {
					current_token: locals.token
				});

				data = robustResult.data;
				refreshError = robustResult.error;

				if (!refreshError) {
					console.log('refresh_token_robust succeeded where others failed');
				}
			}
		}

		if (refreshError) {
			console.error('Refresh token error details:', refreshError);
			throw error(401, { message: 'Failed to refresh token' });
		}

		// Extract the new token
		const newToken = data;
		console.log('Token refresh successful');

		// Get rememberMe setting from existing cookie (if available)
		// This preserves the user's preference for session length
		const existingCookie = cookies.get('auth_token');
		const isLongSession = existingCookie && cookies.get('remember_me') === 'true';
		console.log('Long session:', isLongSession);

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

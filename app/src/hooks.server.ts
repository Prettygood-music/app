import { decodeJwt, extractUserFromJwt } from '$lib/auth/jwt';
import { databaseClient } from '$lib/databaseClient';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get the token from cookies
	const token = event.cookies.get('auth_token');
	if (token) {
		const decodedJWT = await decodeJwt(token);

		if (decodedJWT) {
			const user = extractUserFromJwt(decodedJWT);
			console.dir(user);
			event.locals.user = user;
			event.locals.token = token;
		}
	}
	/*
	if (token) {

		console.log('got token', token);
		try {
			// Setup the auth token for the database client
			//databaseClient.auth(token);
      

			// Get user data
			const { data, error } = await databaseClient
				.from('users')
				.select('id, username, display_name, email, email_verified, wallet_address')
				.single();
			console.dir(data);

			if (data && !error) {
				// Set user info in locals for use in routes
				event.locals.user = data;
				event.locals.token = token;
			} else {
				// Invalid token, clear it
				event.cookies.delete('auth_token', { path: '/' });
			}
		} catch (error) {
			console.error('Auth error:', error);
			// Clear invalid token
			event.cookies.delete('auth_token', { path: '/' });
		}
	}*/

	// Continue with the request
	const response = await resolve(event);

	// Set security headers
	if (response.headers) {
		// Add security headers
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-XSS-Protection', '1; mode=block');

		// In production, add stricter security headers
		if (process.env.NODE_ENV === 'production') {
			response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
			response.headers.set(
				'Content-Security-Policy',
				"default-src 'self'; script-src 'self'; object-src 'none';"
			);
		}
	}

	return response;
};

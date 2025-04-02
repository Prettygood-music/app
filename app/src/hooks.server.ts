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
			event.locals.user = user;
			event.locals.token = token;
		}
	}

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

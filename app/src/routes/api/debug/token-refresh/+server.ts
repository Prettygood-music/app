import { databaseClient } from '$lib/databaseClient';
import { json, error } from '@sveltejs/kit';
import { decodeJwt } from '$lib/auth/jwt';

/**
 * DEBUG ONLY - DO NOT USE IN PRODUCTION
 * This endpoint specifically helps diagnose token refresh issues
 */
export async function POST({ cookies, locals }) {
	// Ensure this is only accessible in development
	if (process.env.NODE_ENV === 'production') {
		throw error(404, { message: 'Not found' });
	}

	// Get the token
	const token = locals.token || cookies.get('auth_token');
	if (!token) {
		return json({
			status: 'error',
			message: 'No token available'
		});
	}

	try {
		// Split the token for basic analysis
		const parts = token.split('.');
		if (parts.length !== 3) {
			return json({
				status: 'error',
				message: 'Invalid token format - must have 3 parts (header.payload.signature)',
				tokenLength: token.length,
				partsCount: parts.length
			});
		}

		// Basic client-side decode
		const decodedToken = await decodeJwt(token);
		
		// Call the debug function in the database
		console.log('Calling debug_refresh_token...');
		const { data: debugData, error: debugError } = await databaseClient.rpc('debug_refresh_token', {
			current_token: token
		});

		if (debugError) {
			console.error('Debug token error:', debugError);
			return json({
				status: 'error',
				message: 'Error debugging token',
				error: debugError,
				clientDecoded: decodedToken ? {
					sub: decodedToken.sub,
					exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : null,
					iat: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : null
				} : null
			});
		}

		// Try a normal refresh - this code similar to the main refresh endpoint
		console.log('Testing normal refresh...');
		const { data: refreshData, error: refreshError } = await databaseClient.rpc('refresh_token', {
			current_token: token
		});

		return json({
			status: 'success',
			message: 'Token analysis complete',
			debugResults: debugData,
			refreshWorked: !refreshError,
			refreshError: refreshError,
			clientDecoded: decodedToken ? {
				sub: decodedToken.sub,
				exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : null,
				iat: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : null,
				role: decodedToken.role,
				username: decodedToken.username
			} : null
		});
	} catch (err) {
		console.error('Debug endpoint error:', err);
		throw error(500, { message: 'Debug endpoint error' });
	}
}

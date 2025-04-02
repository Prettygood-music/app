import { databaseClient } from '$lib/databaseClient';
import { json, error } from '@sveltejs/kit';
import { decodeJwt } from '$lib/auth/jwt';

/**
 * DEBUG ONLY - DO NOT USE IN PRODUCTION
 * This endpoint helps diagnose JWT token issues
 * It should be disabled or removed in production
 */
export async function POST({ request, cookies, locals }) {
	// Ensure this is only accessible in development
	if (process.env.NODE_ENV === 'production') {
		throw error(404, { message: 'Not found' });
	}
	
	try {
		const body = await request.json();
		const { action } = body;
		
		// Get current token from locals or cookies
		const token = locals.token || cookies.get('auth_token');
		
		// Basic token info
		if (action === 'tokenInfo' && token) {
			const decoded = await decodeJwt(token);
			if (!decoded) {
				return json({ status: 'error', message: 'Cannot decode token' });
			}
			
			// Return token info without sensitive parts
			return json({
				status: 'success',
				tokenInfo: {
					sub: decoded.sub,
					role: decoded.role,
					username: decoded.username,
					exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
					iat: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
					expiresIn: decoded.exp ? Math.max(0, decoded.exp - Math.floor(Date.now() / 1000)) : 0,
					isExpired: decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : true
				}
			});
		}
		
		// Test direct database decode
		if (action === 'verifyInDb' && token) {
			// This will use the database to verify the token
			const { data, error: verifyError } = await databaseClient.rpc("debug_verify_token", {
				token
			});
			
			if (verifyError) {
				return json({ 
					status: 'error', 
					message: 'Database verification failed',
					error: verifyError
				});
			}
			
			return json({
				status: 'success',
				dbVerification: data
			});
		}
		
		// Check JWT secret
		if (action === 'checkSecret') {
			const { data, error: secretError } = await databaseClient.rpc("debug_get_jwt_info");
			
			if (secretError) {
				return json({ 
					status: 'error', 
					message: 'Could not check JWT configuration',
					error: secretError
				});
			}
			
			return json({
				status: 'success',
				jwtInfo: data
			});
		}
		
		return json({ status: 'error', message: 'Invalid action' });
	} catch (err) {
		console.error('Debug endpoint error:', err);
		throw error(500, { message: 'Debug endpoint error' });
	}
}

import { databaseClient } from '$lib/databaseClient';
import { json, error } from '@sveltejs/kit';
import { decodeJwt } from '$lib/auth/jwt';
import * as jose from 'jose';

/**
 * DEBUG ONLY - DO NOT USE IN PRODUCTION
 * Advanced token debugging endpoint that shows detailed token verification
 */
export async function POST({ request, cookies, locals }) {
	// Ensure this is only accessible in development
	if (process.env.NODE_ENV === 'production') {
		throw error(404, { message: 'Not found' });
	}

	try {
		// Get the token from request, locals, or cookies
		const body = await request.json();
		const token = body.token || locals.token || cookies.get('auth_token');
		
		if (!token) {
			return json({
				status: 'error',
				message: 'No token provided'
			});
		}
		
		// Print token for reference
		console.log('Debugging token:', token);
		
		// Split token and analyze parts
		const parts = token.split('.');
		if (parts.length !== 3) {
			return json({
				status: 'error',
				message: 'Invalid token format - must have 3 parts',
				parts
			});
		}
		
		// Basic client-side decode (just to check format)
		let decodedToken;
		try {
			decodedToken = await decodeJwt(token);
			console.log('Client-side decoded token:', decodedToken);
		} catch (e) {
			console.error('Client decode error:', e);
			decodedToken = null;
		}
		
		// Use jose for a more detailed decode
		let joseHeader, josePayload;
		try {
			joseHeader = jose.decodeProtectedHeader(token);
			josePayload = jose.decodeJwt(token);
			console.log('Jose decode header:', joseHeader);
			console.log('Jose decode payload:', josePayload);
		} catch (e) {
			console.error('Jose decode error:', e);
		}
		
		// Call the database token tracer
		console.log('Calling database token tracer...');
		const { data: traceData, error: traceError } = await databaseClient.rpc('trace_token_verification', {
			token
		});
		
		if (traceError) {
			console.error('Token trace error:', traceError);
			return json({
				status: 'error',
				message: 'Error tracing token',
				error: traceError,
				clientDecoded: decodedToken,
				joseHeader,
				josePayload,
				tokenParts: {
					header: parts[0],
					payload: parts[1],
					signature: parts[2]
				}
			});
		}
		
		// Try the new refresh token v2 function
		console.log('Testing refresh_token_v2...');
		let refreshResult = null;
		let refreshError = null;
		
		try {
			const { data, error: refError } = await databaseClient.rpc('refresh_token_v2', {
				current_token: token
			});
			
			refreshResult = data;
			refreshError = refError;
			
			if (refError) {
				console.error('refresh_token_v2 error:', refError);
			} else {
				console.log('refresh_token_v2 success');
			}
		} catch (e) {
			console.error('Error calling refresh_token_v2:', e);
		}
		
		// Return all debug information
		return json({
			status: 'success',
			message: 'Token debug completed',
			tokenParts: {
				header: parts[0],
				payload: parts[1],
				signature: parts[2]
			},
			joseDecode: {
				header: joseHeader,
				payload: josePayload
			},
			clientDecode: decodedToken,
			databaseTrace: traceData,
			refreshV2: {
				success: refreshError === null,
				result: refreshResult,
				error: refreshError
			}
		});
	} catch (err) {
		console.error('Debug endpoint error:', err);
		return json({ 
			status: 'error',
			message: 'Debug endpoint error',
			error: err.message
		});
	}
}

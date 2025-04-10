import { databaseClient } from '$lib/databaseClient';
import { json, error } from '@sveltejs/kit';

/**
 * DEBUG ONLY - Tests base64 padding fixes
 * This endpoint helps diagnose base64 padding issues in tokens
 */
export async function POST({ request }) {
	// Ensure this is only accessible in development
	if (process.env.NODE_ENV === 'production') {
		throw error(404, { message: 'Not found' });
	}

	try {
		const body = await request.json();
		const { text } = body;
		
		if (!text) {
			return json({
				status: 'error',
				message: 'No text provided'
			});
		}

		// First try decoding without fixing
		let originalDecoded = null;
		let originalError = null;
		
		try {
			// Browser-side base64 decoding
			originalDecoded = atob(text);
		} catch (e) {
			originalError = e.message;
		}
		
		// Call the database function to fix padding
		const { data: fixedPadding, error: fixError } = await databaseClient.rpc('auth.fix_base64_padding', {
			input: text
		});
		
		if (fixError) {
			return json({
				status: 'error',
				message: 'Error fixing base64 padding',
				error: fixError
			});
		}
		
		// Try decoding with fixed padding
		let fixedDecoded = null;
		let fixedError = null;
		
		try {
			// Browser-side base64 decoding
			fixedDecoded = atob(fixedPadding);
		} catch (e) {
			fixedError = e.message;
		}
		
		// Also try with the robust refresh function
		const { data: robustResult, error: robustError } = await databaseClient.rpc('prettygood.refresh_token_robust', {
			current_token: body.token || ''
		});
		
		return json({
			status: 'success',
			inputText: text,
			original: {
				decoded: originalDecoded,
				error: originalError
			},
			fixed: {
				paddedText: fixedPadding,
				decoded: fixedDecoded,
				error: fixedError
			},
			robustRefresh: {
				success: !robustError,
				result: robustResult,
				error: robustError
			}
		});
	} catch (err) {
		console.error('Base64 fix endpoint error:', err);
		return json({ 
			status: 'error',
			message: 'Base64 fix endpoint error',
			error: err.message
		});
	}
}

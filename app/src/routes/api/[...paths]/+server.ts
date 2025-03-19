import { api } from '$lib/api';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, params, locals }) => {
	// console.log("request:",event.request.locals)
	//return api.fetch(request);
	return handleHono(request, params, locals);
};
export const POST: RequestHandler = ({ request, params, locals }) =>
	handleHono(request, params, locals);

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	return handleHono(request, params, locals);
};

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
	return handleHono(request, params, locals);
};

export const DELETE: RequestHandler = async ({ request, params, locals }) => {
	return handleHono(request, params, locals);
};

/**
 * Helper function to handle Hono requests from SvelteKit
 */
async function handleHono(request: Request, params: { paths?: string }, locals: App.Locals) {
	try {
		// Reconstruct the path
		const url = new URL(request.url);
		const path = `/api/${params.paths}`;
		url.pathname = path;

		// Clone the request with the correct path
		const newRequest = new Request(url.toString(), {
			method: request.method,
			headers: request.headers,
			body: request.body,
			credentials: request.credentials,
			cache: request.cache,
			redirect: request.redirect,
			integrity: request.integrity,
			keepalive: request.keepalive,
			mode: request.mode,
			referrer: request.referrer,
			referrerPolicy: request.referrerPolicy
		});
		// Call Hono app with the locals
		const res = await api.fetch(newRequest, {
			// Pass SvelteKit locals to Hono
			locals
		});

		return res;
	} catch (e) {
		console.error('Error in Hono handler:', e);
		error(500, 'Internal Server Error');
	}
}

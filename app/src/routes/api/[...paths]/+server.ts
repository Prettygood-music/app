import { api } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (event) => {
	// console.log("request:",event.request.locals)

	return api.fetch(event.request, {
		method: 'GET',
		locals: event.locals
	});
};
export const POST: RequestHandler = ({ request }) => api.fetch(request);

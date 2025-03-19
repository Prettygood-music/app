import { browser } from '$app/environment';
import { hc } from 'hono/client';
import type { Router } from './api';

export function makeClient(fetch: Window['fetch']) {
	//const isBrowser = typeof window !== "undefined";
	let origin = '';
	if (browser) {
		origin = window.location.origin;
	}

	// return hc<Router>(origin + '/api', { fetch });
	return hc<Router>(origin, { fetch });
}

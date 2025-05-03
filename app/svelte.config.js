import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),

		// Enable service worker
		serviceWorker: {
			register: true
		},
		/*
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ["'self'"],
				'img-src': ["'self'", 'data:', 'https:', 'http:'],
				'style-src': ["'self'", "'unsafe-inline'", 'https:', 'http:'],
				'font-src': ["'self'", 'data:', 'https:', 'http:'],
				'connect-src': ["'self'", 'https:', 'http:']
			}
		}*/
	},

	extensions: ['.svelte', '.svx']
};

export default config;

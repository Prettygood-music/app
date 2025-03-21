import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	server: {
		allowedHosts: ['93e2-2a01-e0a-80d-2240-4404-4cf-9fbc-7088.ngrok-free.app']
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
}));

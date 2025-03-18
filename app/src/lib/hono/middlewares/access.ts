import type { MiddlewareHandler } from 'hono';
//import type { User } from '$lib/types';

// Define the locals type that will be available in Hono's env
/*
declare module 'hono' {
	interface Env {
		locals: {
			user?: User;
			token?: string;
		};
	}

	interface ContextVariableMap {
		user?: User;
	}
}*/

/**
 * Authentication middleware for Hono that works with SvelteKit locals
 *
 * This middleware checks for a user in env.locals (injected by SvelteKit)
 * and makes it available to Hono route handlers
 *
 * @param options Optional configuration
 * @returns Hono middleware handler
 */
export function authMiddleware(
	options: {
		requireArtist?: boolean;
		optional?: boolean;
	} = {}
): MiddlewareHandler {
	return async (c, next) => {
		// Access the user from SvelteKit's locals
		const user = c.env.locals?.user;

		// If no user and authentication is required
		if (!user && !options.optional) {
			return c.json({ error: 'Authentication required' }, 401);
		}

		// If user exists, check if they need to be an artist
		if (user && options.requireArtist && !user.is_artist) {
			return c.json({ error: 'Artist account required' }, 403);
		}

		// Set user in Hono context for easier access in route handlers
		if (user) {
			c.set('user', user);
		}

		await next();
	};
}

/**
 * For development/testing without SvelteKit, this middleware
 * simulates authentication using the Authorization header
 */

export function mockAuthMiddleware(): MiddlewareHandler {
	return async (c, next) => {
		// Only use in development
		if (process.env.NODE_ENV === 'production') {
			await next();
			return;
		}

		const authHeader = c.req.header('Authorization');

		if (authHeader) {
			const [type, token] = authHeader.split(' ');

			if (type === 'Bearer' && token) {
				// Import mock data here to avoid circular dependencies
				const { mockUsers } = await import('../../data/mocks');

				// Try to find user by ID first (for testing specific users)
				let user = mockUsers.find((u) => u.id === token);

				// If not found, just use the first artist
				if (!user) {
					user = mockUsers.find((u) => u.is_artist) || mockUsers[0];
				}

				// Set in both env.locals and context
				if (!c.env.locals) {
					c.env.locals = {};
				}

				c.env.locals.user = user;
				c.env.locals.token = token;
				c.set('user', user);

				console.log(`[DEV AUTH] Using mock user: ${user.display_name} (${user.id})`);
			}
		}

		await next();
	};
}

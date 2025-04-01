import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { databaseClient } from '$lib/databaseClient';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schemas';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Call authenticate_user RPC function
		const { data, error } = await databaseClient.rpc('authenticate_user', {
			_email_or_username: form.data.emailOrUsername,
			_password: form.data.password
		});

		if (error) {
			console.log(error);
			return handlePostgrestError(error);
		}

		// Extract JWT token from response
		const token = data;

		// Set JWT in cookie
		const cookieOptions = {
			httpOnly: true,
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: form.data.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 24 hours
		};

		event.cookies.set('auth_token', token, cookieOptions);
		return { form };
		/*
		const { request, cookies, url } = event;
		const formData = await request.formData();

		try {
			// Validate form data
			const validatedData = loginSchema.parse({
				emailOrUsername: formData.get('emailOrUsername'),
				password: formData.get('password'),
				rememberMe: formData.get('rememberMe') === 'on'
			});

			// Call authenticate_user RPC function
			const { data, error } = await databaseClient.rpc('authenticate_user', {
				email_or_username: validatedData.emailOrUsername,
				password: validatedData.password
			});

			if (error) {
				return handlePostgrestError(error);
			}

			// Extract JWT token from response
			const token = data;

			// Set JWT in cookie
			const cookieOptions = {
				httpOnly: true,
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 24 hours
			};

			cookies.set('auth_token', token, cookieOptions);

			// Redirect to the requested page or default to dashboard
			const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
			throw redirect(303, redirectTo);
		} catch (error) {
			return handleLoginError(error);
		}
			*/
	}
};

function handleLoginError(error: unknown) {
	// Handle zod validation errors
	if (error instanceof z.ZodError) {
		const fieldErrors = error.flatten().fieldErrors;
		return fail(400, {
			error: true,
			message: 'Please check your input',
			fieldErrors,
			values: error.input // Return the input values for form repopulation
		});
	}

	// Generic error
	console.error('Login error:', error);
	return fail(500, {
		error: true,
		message: 'An unexpected error occurred during login. Please try again.'
	});
}

function handlePostgrestError(error: any) {
	if (error.message?.includes('Invalid email/username or password')) {
		return fail(401, {
			error: true,
			message: 'Invalid email/username or password',
			authError: true
		});
	}

	if (error.message?.includes('Account is temporarily locked')) {
		return fail(429, {
			error: true,
			message:
				'Account is temporarily locked due to too many failed login attempts. Please try again later.',
			accountLocked: true
		});
	}

	return fail(500, {
		error: true,
		message: error.message || 'An error occurred during login'
	});
}

// Provide any page data needed
export async function load({ locals }) {
	// If user is already logged in, redirect to dashboard

	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	const form = await superValidate(zod(loginSchema));

	return { form };
}

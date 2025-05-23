import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';

// Forgot password validation schema
const forgotPasswordSchema = z.object({
	email: z.string().email('Please enter a valid email address')
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		try {
			// Validate form data
			const validatedData = forgotPasswordSchema.parse({
				email: formData.get('email')
			});

			const { data, error } = await locals.supabase.auth.resetPasswordForEmail(validatedData.email);

			if (error) {
				console.error('Password reset request error:', error);
			}

			// Always redirect to the same page for security (to prevent email enumeration)
			throw redirect(303, '/auth/reset-sent');
		} catch (error) {
			if (error instanceof z.ZodError) {
				return fail(400, {
					error: true,
					message: 'Please check your input',
					fieldErrors: error.flatten().fieldErrors,
					values: error.input
				});
			}

			// Always succeed even if there's an error (for security)
			throw redirect(303, '/auth/reset-sent');
		}
	}
};

// Provide any page data needed
export function load({ locals }) {
	// If user is already logged in, redirect to dashboard
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	return {};
}

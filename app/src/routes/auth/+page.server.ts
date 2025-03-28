import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { databaseClient } from '$lib/databaseClient';
import type { Actions } from './$types';

// Define registration schema
const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  displayName: z.string().optional(),
  terms: z.enum(['on']).optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
).refine(
  (data) => data.terms === 'on',
  {
    message: 'You must accept the terms and conditions',
    path: ['terms']
  }
);

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const formValues = Object.fromEntries(formData.entries());

    try {
      // Validate form data
      const validatedData = registerSchema.parse({
        email: formValues.email,
        username: formValues.username,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        displayName: formValues.displayName || undefined,
        terms: formValues.terms
      });

      // Call the register_user RPC function
      const { data, error } = await databaseClient.rpc('register_user', {
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        display_name: validatedData.displayName || null
      });

      if (error) {
        return handlePostgrestError(error);
      }

      // Extract data from the response
      const { user_id, verification_token } = data;

      // In a real app, send an email with the verification token
      console.log(`Verification link: http://localhost:5173/verify-email/${verification_token}`);

      // Redirect to verification notice page
      throw redirect(303, '/auth/verify-notice');
    } catch (error) {
      return handleRegistrationError(error);
    }
  }
};

function handleRegistrationError(error: unknown) {
  // Handle zod validation errors
  if (error instanceof z.ZodError) {
    const fieldErrors = error.flatten().fieldErrors;
    return fail(400, {
      error: true,
      message: 'Validation failed',
      fieldErrors,
      values: error.input // Return the input values for form repopulation
    });
  }

  // Generic error
  console.error('Registration error:', error);
  return fail(500, {
    error: true,
    message: 'An unexpected error occurred during registration. Please try again.'
  });
}

function handlePostgrestError(error: any) {
  // Handle specific database errors
  if (error.message?.includes('Username already exists')) {
    return fail(400, {
      error: true,
      message: 'Username already exists',
      fieldErrors: { username: ['This username is already taken'] },
    });
  }

  if (error.message?.includes('Email already exists')) {
    return fail(400, {
      error: true,
      message: 'Email already exists',
      fieldErrors: { email: ['This email address is already registered'] },
    });
  }

  // Generic database error
  return fail(500, {
    error: true,
    message: error.message || 'An error occurred during registration'
  });
}

// Provide any page data needed
export function load({ locals }) {
  // If user is already logged in, redirect to dashboard
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }
  
  return {};
}
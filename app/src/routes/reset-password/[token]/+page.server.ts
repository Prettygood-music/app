import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { databaseClient } from '$lib/databaseClient';
import type { Actions } from './$types';

// Password reset validation schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

export const actions: Actions = {
  default: async ({ request, params }) => {
    const { token } = params;
    const formData = await request.formData();
    
    try {
      // Validate form data
      const validatedData = resetPasswordSchema.parse({
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
      });
      
      // Call reset_password RPC function
      const { data, error } = await databaseClient.rpc('reset_password', { 
        reset_token: token, 
        new_password: validatedData.password 
      });
      
      if (error) {
        return handlePostgrestError(error);
      }
      
      // Redirect to login page with a success parameter
      throw redirect(303, '/login?reset=true');
    } catch (error) {
      if (error instanceof z.ZodError) {
        return fail(400, {
          error: true,
          message: 'Please check your input',
          fieldErrors: error.flatten().fieldErrors,
        });
      }
      
      console.error('Password reset error:', error);
      return fail(500, {
        error: true,
        message: 'An error occurred while resetting your password'
      });
    }
  }
};

function handlePostgrestError(error: any) {
  if (error.message?.includes('Invalid or expired reset token')) {
    return fail(400, {
      error: true,
      message: 'Invalid or expired reset token. Please request a new password reset.',
      tokenError: true
    });
  }
  
  return fail(500, {
    error: true,
    message: error.message || 'An error occurred while resetting your password'
  });
}

// Page load function to verify token before showing the form
export async function load({ params }) {
  const { token } = params;
  
  // You can add a token validation function here if needed
  // For now, we'll just pass the token to the page
  return {
    token
  };
}
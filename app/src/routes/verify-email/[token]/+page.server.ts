import { error, redirect } from '@sveltejs/kit';
import { databaseClient } from '$lib/databaseClient';

export async function load({ params }) {
  const { token } = params;
  
  try {
    // Call verify_email RPC function
    const { data, error: pgError } = await databaseClient.rpc('verify_email', { 
      verification_token: token
    });
      
    if (pgError) {
      if (pgError.message?.includes('Invalid verification token')) {
        throw error(400, 'Invalid verification token');
      }
      
      if (pgError.message?.includes('Verification token has expired')) {
        throw error(410, 'Verification token has expired. Please request a new one.');
      }
      
      throw error(500, 'An error occurred during email verification');
    }
    
    // Redirect to login page with a success parameter
    throw redirect(303, '/login?verified=true');
  } catch (err) {
    console.error('Email verification error:', err);
    
    if (err.status) {
      throw err; // It's already a SvelteKit error, rethrow it
    }
    
    throw error(500, 'An error occurred during email verification');
  }
}
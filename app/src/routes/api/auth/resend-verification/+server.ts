import { json, redirect } from '@sveltejs/kit';
import { databaseClient } from '$lib/databaseClient';

export async function POST({ request, cookies }) {
  const data = await request.formData();
  const email = data.get('email');
  
  if (!email) {
    // If no email provided, redirect to a form where they can enter it
    throw redirect(303, '/auth/resend-verification');
  }
  
  try {
    // First get the user ID
    const { data: userData, error: userError } = await databaseClient
      .from('users')
      .select('id, email_verified')
      .eq('email', email)
      .single();
      
    if (userError) {
      // Don't reveal if email exists or not
      throw redirect(303, '/auth/verification-sent');
    }
    
    // Check if email is already verified
    if (userData.email_verified) {
      throw redirect(303, '/login?verified=true');
    }
    
    // Create a new verification token
    const { data: tokenData, error: tokenError } = await databaseClient
      .rpc('create_email_verification_token', { user_id: userData.id });
      
    if (tokenError) {
      console.error('Error creating verification token:', tokenError);
      throw redirect(303, '/auth/error');
    }
    
    // In a real app, send an email with the verification link
    console.log(`Verification link: http://localhost:5173/verify-email/${tokenData}`);
    
    // Redirect to confirmation page
    throw redirect(303, '/auth/verification-sent');
  } catch (error) {
    console.error('Resend verification error:', error);
    
    // Always redirect to the same page for security
    throw redirect(303, '/auth/verification-sent');
  }
}
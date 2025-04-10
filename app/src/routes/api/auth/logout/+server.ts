import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  // Clear the auth cookie
  cookies.delete('auth_token', { path: '/' });
  
  // Redirect to home page or login
  throw redirect(303, '/login?logged_out=true');
}

// Also support GET for simple <a href> logout links
export async function GET({ cookies }) {
  // Clear the auth cookie
  cookies.delete('auth_token', { path: '/' });
  
  // Redirect to home page or login
  throw redirect(303, '/login?logged_out=true');
}
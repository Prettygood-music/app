import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
  // Redirect to login if user is not authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  return {
    user: locals.user
  };
}

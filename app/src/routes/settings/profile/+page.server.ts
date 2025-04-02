import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Ensure the user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login?redirectTo=/settings/profile');
  }
  
  // Return the user data
  return {
    user: locals.user,
    token: locals.token
  };
};

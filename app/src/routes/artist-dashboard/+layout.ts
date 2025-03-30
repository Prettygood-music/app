import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, parent }) => {
  // Get parent data which should include user info
  const parentData = await parent();
  
  // Check if user exists and is logged in
  if (!parentData.user) {
    // Redirect to login page if not logged in
    throw redirect(303, '/login?redirect=/artist-dashboard');
  }
  
  // Check if user is an artist (has artist profile)
  const artistResponse = await fetch('/api/me/artist-profile');
  
  if (!artistResponse.ok) {
    // If status is 404, user is not an artist
    if (artistResponse.status === 404) {
      // Redirect to artist registration/upgrade page
      throw redirect(303, '/settings/become-artist?redirect=/artist-dashboard');
    }
    
    // For other errors, just throw to the error boundary
    throw new Error('Failed to fetch artist profile');
  }
  
  // Parse artist data
  const artistData = await artistResponse.json();
  
  // Return artist data for use in all dashboard pages
  return {
    artist: artistData
  };
};

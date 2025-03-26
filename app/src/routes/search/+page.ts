import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// This page just shows the search form or redirects to results
export const load: PageLoad = async ({ url }) => {
  // Check if there's a search query in the URL
  const query = url.searchParams.get('q');
  
  // If there's a query, redirect to the search results page
  if (query) {
    throw redirect(307, `/search/${encodeURIComponent(query)}`);
  }
  
  // Otherwise, just return empty data for the search form
  return {
    query: ''
  };
};

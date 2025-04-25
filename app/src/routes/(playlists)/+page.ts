import type { PageLoad } from '../$types';

export const load = (async ({ parent }) => {
	const { supabase } = await parent();

	const { data: recommendedArtists } = await supabase.from('artists').select('*').limit(10);
	const { data: recommendedTracks } = await supabase.from('tracks').select('*, artist: artists(artist_name)').limit(10);
	const { data: recommendedAlbums } = await supabase.from('albums').select('*').limit(10);


	return {
		recommendations: {
			tracks: recommendedTracks || [],
			albums: recommendedAlbums || [],
			artists: recommendedArtists || []
		}
	};
}) satisfies PageLoad;

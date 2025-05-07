import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase } = await parent();

	const { data: recommendedArtists } = await supabase.from('artists').select('*').limit(10);
	const { data: recommendedTracks } = await supabase
		.from('tracks')
		.select('*, artist: artists(artist_name), album: albums(cover_url)')
		.limit(10);
	const { data: recommendedAlbums } = await supabase.from('albums').select('*').limit(10);
	const { data: recommendedPlaylists } = await supabase
		.from('playlists')
		.select('*, tracks(*), creator:users!playlists_user_id_fkey(*)')
		.limit(10);

	return {
		recommendations: {
			tracks: recommendedTracks || [],
			albums: recommendedAlbums || [],
			artists: recommendedArtists || [],
			playlists: recommendedPlaylists || []
		}
	};
}) satisfies PageLoad;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();
	const { data: trackDB } = await supabase
		.from('tracks')
		.select('*, artist: artists(*), album: albums(*, tracks(id))')
		.eq('id', params.id)
		.single();

	const { data: liked, error: likeError } = await supabase
		.from('track_likes')
		.select('*')
		.eq('track_id', params.id)
		.eq('user_id', user?.id)
		.maybeSingle();

	const { data: trackDetails } = await supabase
		.from('tracks_with_details')
		.select('*')
		.in('id', [...(trackDB?.album?.tracks?.map((t) => t.id) || []), trackDB!.id]);
	//.eq('album_id', album.id);

	if (!trackDB) {
		error(404, 'Track not found');
	}

	const trackWithDetails = trackDetails!.find((t) => t.id === trackDB.id)!;
	return {
		track: trackWithDetails,
		artist: trackDB.artist!,
		album: trackDB.album,
		isLiked: liked ? true : false,
		recommendedTracks: trackDetails || []
	};
};

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();
	const { data: trackDB } = await supabase
		.from('tracks')
		.select('*, artist: artists(*), album: albums(*, tracks(*))')
		.eq('id', params.id)
		.single();

	const { data: liked, error: likeError } = await supabase
		.from('track_likes')
		.select('*')
		.eq('track_id', params.id)
		.eq('user_id', user?.id)
		.maybeSingle();

	if (!trackDB) {
		error(404, 'Track not found');
	}
	return {
		track: trackDB,
		isLiked: liked ? true : false
	};
};

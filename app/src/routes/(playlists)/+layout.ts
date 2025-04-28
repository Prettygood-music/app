import { DEPENDS } from '$lib/constants';
import type { Database } from '@prettygood/database';
import type { LayoutLoad } from './$types';

export const load = (async ({ depends, parent }) => {
	const { supabase, session, user } = await parent();

	let playlists: Database['public']['Tables']['playlists']['Row'][] = [];
	if (user) {
		const { data } = await supabase
			.from('playlists')
			.select('*, creator:users!playlists_user_id_fkey(*), tracks(id)')
			.eq('user_id', user.id);
		if (data) {
			playlists = data;
		}
	}
	depends(DEPENDS.PLAYLISTS);

	return { playlists };
}) satisfies LayoutLoad;

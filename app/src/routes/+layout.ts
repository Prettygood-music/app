import { DEPENDS } from '$lib/constants';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import type { Database } from '@prettygood/database';

export const load = (async ({ depends, data }) => {
	depends(DEPENDS.AUTH);

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */

	const [{ data: session }, { data: user }] = await Promise.all([
		supabase.auth.getSession(),
		supabase.auth.getUser()
	]);
	
	return {
		user: user.user,
		session: session.session,
		supabase
	};
}) satisfies LayoutLoad;

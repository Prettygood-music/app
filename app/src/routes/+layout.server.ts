import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	//const { session } = await safeGetSession();
	const c = cookies.getAll();

	const { session } = await locals.safeGetSession();
	return {
		session,
		user: locals.user,
		cookies: c
	};
};

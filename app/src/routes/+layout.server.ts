import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	//const { session } = await safeGetSession();
	console.dir(locals);
    const c = cookies.getAll();
    console.dir(c)
    return {
		//session,
        user: locals.user,
		cookies: c
	};
};

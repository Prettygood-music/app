import { PUBLIC_POSTGREST_URL } from '$env/static/public';
import { createClient } from '@prettygood/database';

export const databaseClient = createClient(PUBLIC_POSTGREST_URL);

export function getDatabaseClient(userToken: string) {
	return createClient(PUBLIC_POSTGREST_URL, {
		Authorization: `Bearer ${userToken}`
	});
}

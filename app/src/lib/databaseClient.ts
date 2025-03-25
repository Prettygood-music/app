import { PUBLIC_POSTGREST_URL } from "$env/static/public";
import { createClient } from "@prettygood/database";

export const databaseClient = createClient(PUBLIC_POSTGREST_URL);
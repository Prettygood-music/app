import { PostgrestClient } from "@supabase/postgrest-js";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
export * from "@supabase/supabase-js";

export * from "./database.schema";
export * from "./types";
/**
 * @deprecated
 * @description This function is deprecated. Use createClientV2 instead.
 * @param url
 * @param headers
 * @returns
 */
export function createClient(url: string, headers?: Record<string, string>) {
  return new PostgrestClient<Database>(url, {
    headers,
  });
}

export function createClientV2(url: string, key: string) {
  return createSupabaseClient<Database>(url, key);
}

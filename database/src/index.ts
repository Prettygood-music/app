import { PostgrestClient } from "@supabase/postgrest-js";
import { Database } from "./types";

export * from "./database.schema";
export * from "./types";

export function createClient(url: string) {
  return new PostgrestClient<Database>(url);
}

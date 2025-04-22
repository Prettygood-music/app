import type { createClientV2, Session, User } from '@prettygood/database';
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: ReturnType<typeof createClientV2>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			/*
      user: {
        id: string;
        username: string;
        display_name: string | null;
        email: string;
        email_verified: boolean;
        wallet_address: string | null;
      } | null;*/
			/**
			 * @deprecated
			 * Use `locals.supabase.auth.getSession()` instead.
			 */
			token: string | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

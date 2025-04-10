// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        id: string;
        username: string;
        display_name: string | null;
        email: string;
        email_verified: boolean;
        wallet_address: string | null;
      } | null;
      token: string | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};

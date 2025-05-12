// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		auth: import('@auth/sveltekit').SvelteKitAuth;
	}
	interface PageData {
		session: import('@auth/sveltekit').Session | null;
	}
	interface Error {
		message: string;
		code?: string;
	}
	interface Platform {}
}

import '@auth/sveltekit';
declare module '@auth/sveltekit' {
	interface User {
		role: string;
	}
	interface Session {
		user: User;
	}
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

import "@auth/sveltekit"
declare module "@auth/sveltekit" {
  interface User {
    role: string
  }
}

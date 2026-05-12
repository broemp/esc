import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		imagetools({
			defaultDirectives: new URLSearchParams([
				['format', 'webp'],
				['quality', '80']
			])
		})
	]
});

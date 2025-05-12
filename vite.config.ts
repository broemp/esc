import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	server: {
		fs: {
			allow: [
				// Allow serving files from the project root
				resolve(__dirname, 'static'),
				// Keep existing allowed directories
				'/home/broemp/esc/src/lib',
				'/home/broemp/esc/src/routes',
				'/home/broemp/esc/.svelte-kit',
				'/home/broemp/esc/src',
				'/home/broemp/esc/node_modules'
			]
		}
	}
});

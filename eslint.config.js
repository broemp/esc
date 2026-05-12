import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	{
		files: ['**/*.{ts,js}'],
		plugins: { '@typescript-eslint': ts },
		languageOptions: {
			parser: tsParser,
			parserOptions: { sourceType: 'module', ecmaVersion: 2020 }
		},
		rules: {
			...ts.configs.recommended.rules
		}
	},
	{
		files: ['**/*.svelte'],
		plugins: { svelte, '@typescript-eslint': ts },
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		},
		rules: {
			...svelte.configs.recommended.rules
		}
	},
	prettier,
	{
		ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**']
	}
];

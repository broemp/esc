import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.DB_HOST!,
		user: process.env.DB_USER,
		port: +process.env.DB_PORT!,
		password: process.env.DB_PASS,
		database: process.env.DB_DB!,
		ssl: process.env.DB_SSL?.toLowerCase() === 'true'
	}
});

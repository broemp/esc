import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER,
    port: +process.env.DB_PORT!,
    password: process.env.DB_PASS,
    database: process.env.DB_DB!,
    ssl:  (process.env.DB_SSL?.toLowerCase() == "true"),
  },
} satisfies Config;

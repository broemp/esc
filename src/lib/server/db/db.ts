import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let ssl: 'require' | 'allow' | 'prefer' | 'verify-full' | boolean | object = false
if (env.DB_SSL && env.DB_SSL.toLowerCase() == "true") {
  ssl = 'require'
}

const dbOptions: postgres.Options<any> = {
  host: env.DB_HOST,
  port: +env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_DB,
  ssl: ssl,
  max: 1,
}

const migrationClient = postgres("", dbOptions);
migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" })

dbOptions.max = undefined

const queryClient = postgres("", dbOptions);
export const db = drizzle(queryClient);

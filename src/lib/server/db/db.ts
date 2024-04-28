import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_DB, DB_SSL } from '$env/static/private';

const dbOptions: postgres.Options<any> = {
  host: DB_HOST,
  port: +DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_DB,
  ssl: (DB_SSL.toLowerCase() == "true"),
  max: 1,
}

const migrationClient = postgres("", dbOptions);
migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" })

dbOptions.max = undefined

const queryClient = postgres("", dbOptions);
export const db = drizzle(queryClient);

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let ssl: 'require' | 'allow' | 'prefer' | 'verify-full' | boolean | object = false;
if (env.DB_SSL && env.DB_SSL.toLowerCase() == 'true') {
	ssl = 'require';
}

const dbOptions: postgres.Options<any> = {
	host: env.DB_HOST,
	port: +env.DB_PORT,
	user: env.DB_USER,
	password: env.DB_PASS,
	database: env.DB_DB,
	ssl: ssl,
	max: 1
};

let _db: ReturnType<typeof drizzle> | null = null;
let _migrationClient: ReturnType<typeof postgres> | null = null;

export async function runMigrations() {
	if (!_migrationClient) {
		_migrationClient = postgres('', dbOptions);
	}
	await migrate(drizzle(_migrationClient), { migrationsFolder: 'drizzle' });
}

export function getDb() {
	if (!_db) {
		const queryClient = postgres('', dbOptions);
		_db = drizzle(queryClient);
	}
	return _db;
}

// For backward compatibility
export const db = {
	...getDb(),
	// Add any methods that need to be called directly on the db object
	select: (...args: Parameters<ReturnType<typeof drizzle>['select']>) => getDb().select(...args),
	insert: (...args: Parameters<ReturnType<typeof drizzle>['insert']>) => getDb().insert(...args),
	update: (...args: Parameters<ReturnType<typeof drizzle>['update']>) => getDb().update(...args),
	delete: (...args: Parameters<ReturnType<typeof drizzle>['delete']>) => getDb().delete(...args),
	execute: (...args: Parameters<ReturnType<typeof drizzle>['execute']>) => getDb().execute(...args)
};

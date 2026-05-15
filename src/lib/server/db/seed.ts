import { getDb } from './db';
import { acts, categories, countries, drinks } from './schema';
import seedData from './seed-data.json';

export async function seedDevData() {
	const db = getDb();

	const existing = await db.select({ id: acts.id }).from(acts).limit(1);
	if (existing.length > 0) return;

	await db.insert(countries).values(seedData.countries).onConflictDoNothing();
	await db.insert(categories).values(seedData.categories).onConflictDoNothing();
	await db.insert(acts).values(
		seedData.acts.map((a) => ({ ...a, eliminated: a.eliminated ?? false }))
	).onConflictDoNothing();
	await db.insert(drinks).values(seedData.drinks).onConflictDoNothing();

	console.log('[seed] Inserted dev seed data');
}

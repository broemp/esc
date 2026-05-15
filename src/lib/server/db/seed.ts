import { getDb } from './db';
import { acts, categories, categoriesInGroup, countries, drinks, groups, users } from './schema';
import seedData from './seed-data.json';

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';
const EVERYBODY_GROUP_ID = '00000000-0000-0000-0000-000000000001';
const SONG_CATEGORY_ID = '30000000-0000-0000-0000-000000000001';

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

	// Ensure system user and Everybody group exist (migration may not have run yet in dev)
	await db.insert(users).values({
		id: SYSTEM_USER_ID,
		email: 'system@esc.local',
		role: 'admin'
	}).onConflictDoNothing();
	await db.insert(groups).values({
		id: EVERYBODY_GROUP_ID,
		admin: SYSTEM_USER_ID,
		name: 'Everybody',
		public: true,
		isDefault: true
	}).onConflictDoNothing();
	await db.insert(categoriesInGroup).values({
		groupId: EVERYBODY_GROUP_ID,
		categoryId: SONG_CATEGORY_ID
	}).onConflictDoNothing();

	console.log('[seed] Inserted dev seed data');
}

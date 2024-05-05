import { asc, eq } from 'drizzle-orm';
import { db } from './db';
import {
  acts,
  categories,
  categoriesInGroup,
  countries,
  groups,
  userInGroups,
  users
} from './schema';
import { createInsertSchema } from 'drizzle-zod';

const insertActSchema = createInsertSchema(acts);
// Returns one act selected by id
export type Act = Awaited<ReturnType<typeof getAct>>;
export function getAct(id: string) {
  return db
    .select()
    .from(acts)
    .where(eq(acts.id, id))
    .leftJoin(countries, eq(acts.countryID, countries.id))
    .limit(1);
}

export type UpdateAct = typeof acts.$inferSelect;
export function updateAct(act: UpdateAct) {
  console.log(act);
  try {
    insertActSchema.parse(act);
  } catch (e) {
    console.log(e);
    return { error: true, message: e };
  }
  return db.update(acts).set(act).where(eq(acts.id, act.id)).returning().execute();
}

export type ActList = Awaited<ReturnType<typeof listActs>>;
export function listActs(limit: number, offset: number) {
  return db
    .select()
    .from(acts)
    .innerJoin(countries, eq(acts.countryID, countries.id))
    .limit(limit)
    .offset(offset)
    .orderBy(asc(acts.position));
}

export type CountryList = Awaited<ReturnType<typeof listCountries>>;
export function listCountries(limit: number, offset: number) {
  return db.select().from(countries).limit(limit).offset(offset);
}

export type NewAct = typeof acts.$inferInsert;
export function createAct(newAct: NewAct) {
  return db.insert(acts).values(newAct).onConflictDoNothing();
}

export type NewCategory = typeof categories.$inferInsert;
export function newCategor(category: NewCategory) {
  return db.insert(categories).values(category);
}

export type CreatedGroup = Awaited<ReturnType<typeof createGroup>>;
export type NewGroup = typeof groups.$inferInsert;
export function createGroup(group: NewGroup) {
  return db.insert(groups).values(group).returning({ id: groups.id });
}

export function addUserToGroup(groupID: string, userID: string) {
  return db.insert(userInGroups).values({ groupId: groupID, userId: userID }).execute();
}

export async function addCategorieToGroup(name: string, groupID: string) {
  let categorie = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, name));
  if (categorie.length == 0) {
    categorie = await db.insert(categories).values({ name: name }).returning();
  }

  return db.insert(categoriesInGroup).values({ groupId: groupID, categoryId: categorie[0].id });
}

export type MembersList = Awaited<ReturnType<typeof getMembersOfGroup>>;
export function getMembersOfGroup(groupID: string) {
  return db
    .select({ username: users.name, userid: users.id })
    .from(groups)
    .where(eq(groups.id, groupID))
    .leftJoin(userInGroups, eq(groups.id, userInGroups.groupId))
    .leftJoin(users, eq(users.id, userInGroups.userId));
}

export type GroupInfo = Awaited<ReturnType<typeof getGroup>>;
export function getGroup(groupID: string) {
  return db.select().from(groups).where(eq(groups.id, groupID)).limit(1);
}

export const JoinGroupSchema = createInsertSchema(userInGroups);
export type JoinGroup = typeof userInGroups.$inferInsert;
export function joinGroup(join: JoinGroup) {
  JoinGroupSchema.parse(join);
  return db
    .insert(userInGroups)
    .values({ groupId: join.groupId, userId: join.userId })
    .onConflictDoNothing()
    .execute();
}

export type CreateCountry = typeof countries.$inferInsert;
export function createCountry(country: CreateCountry) {
  return db.insert(countries).values(country).onConflictDoNothing().execute();
}

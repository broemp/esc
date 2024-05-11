import { and, asc, avg, desc, eq, like, or, sql } from 'drizzle-orm';
import { db } from './db';
import {
  acts,
  categories,
  categoriesInGroup,
  categoriesRelation,
  countries,
  drinks,
  groups,
  groupsRelations,
  userInGroups,
  users,
  votes
} from './schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from "zod";
import type { AwaitedActions } from '@sveltejs/kit';

const UUIDVerifier = z.string().uuid()

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
  insertActSchema.parse(act);
  return db.update(acts).set(act).where(eq(acts.id, act.id)).returning().execute();
}

export function deleteAct(actID: string) {
  console.log("deleting act: ", actID)
  return db.delete(acts).where(eq(acts.id, actID)).execute()
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

export async function nextAdminAct() {
  let votedOn = await db.select().from(acts)
    .innerJoin(votes, eq(votes.actID, acts.id))
    .innerJoin(users, and(eq(users.id, votes.userID), eq(users.role, 'admin')))
    .orderBy(desc(acts.position))

  if (votedOn.length > 0) {
    let lastVote = votedOn[0].act.position!
    return db.select().from(acts).where(eq(acts.position, lastVote + 1)).limit(1)
  }

  return db.select().from(acts).where(eq(acts.position, 1)).limit(1)
}

export type NewAct = typeof acts.$inferInsert;
export function createAct(newAct: NewAct) {
  return db.insert(acts).values(newAct).onConflictDoNothing().execute();
}

export type NewCategory = typeof categories.$inferInsert;
export function newCategory(category: NewCategory) {
  return db.insert(categories).values(category);
}

export type CreatedGroup = Awaited<ReturnType<typeof createGroup>>;
export type NewGroup = typeof groups.$inferInsert;
export function createGroup(group: NewGroup) {
  return db.insert(groups).values(group).returning({ id: groups.id });
}

export function getPublicGroups(limit: number, offset: number) {
  return db.select()
    .from(groups)
    .where(eq(groups.public, true))
    .offset(offset)
    .limit(limit)
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
  UUIDVerifier.parse(groupID)
  return db
    .select({ username: users.name, userid: users.id })
    .from(groups)
    .where(eq(groups.id, groupID))
    .leftJoin(userInGroups, eq(groups.id, userInGroups.groupId))
    .leftJoin(users, eq(users.id, userInGroups.userId));
}

export function getGroupCategories(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db
    .select()
    .from(categoriesInGroup)
    .where(eq(categoriesInGroup.groupId, groupID))
    .leftJoin(categories, eq(categories.id, categoriesInGroup.categoryId))
    .orderBy(asc(categories.position))
}


export type aRankingCategoryGroup = ReturnType<typeof getRankingCategoryGroup>;
export type RankingCategoryGroup = Awaited<ReturnType<typeof getRankingCategoryGroup>>;
export function getRankingCategoryGroup(groupID: string, categoryId: string) {
  UUIDVerifier.parse(groupID)
  UUIDVerifier.parse(categoryId)
  return db
    .select({
      actID: acts.id,
      artist: acts.artist,
      title: acts.title,
      categoryId: votes.categories,
      countryImage: countries.imageURL,
      score: sql<number>`cast(avg(${votes.points}) AS DECIMAL(10,2))`
    })
    .from(votes)
    .where(and(eq(votes.categories, categoryId), eq(votes.userID, userInGroups.userId)))
    .leftJoin(userInGroups, eq(userInGroups.groupId, groupID))
    .leftJoin(acts, eq(acts.id, votes.actID))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .groupBy(acts.id, acts.artist, acts.title, votes.categories, countries.imageURL)
    .orderBy(sql<number>`avg(${votes.points})`)
}

export function getGroupSongVotes(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db
    .select({
      actID: votes.actID,
      artist: acts.artist,
      title: acts.title,
      countryImage: countries.imageURL,
      score: sql<number>`cast(avg(${votes.points}) AS DECIMAL(10,2))`
    })
    .from(groups)
    .where(and(eq(categories.name, "song"), eq(groups.id, groupID)))
    .leftJoin(userInGroups, eq(userInGroups.groupId, groups.id))
    .leftJoin(votes, eq(votes.userID, userInGroups.userId))
    .leftJoin(acts, eq(acts.id, votes.actID))
    .leftJoin(categories, eq(categories.id, votes.categories))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .groupBy(votes.actID, acts.artist, acts.title, countries.imageURL)
    .orderBy(desc(sql<number>`avg(${votes.points})`))
}

export function getGroupVotesByCategory(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db
    .select()
    .from(userInGroups)
    .where(eq(userInGroups.groupId, groupID))
    .leftJoin(categoriesInGroup, eq(categoriesInGroup.groupId, groupID))
    .leftJoin(categories, eq(categories.id, categoriesInGroup.categoryId))
    .leftJoin(votes, and(eq(votes.userID, userInGroups.userId), eq(votes.categories, categories.id)))
}

export type GroupInfo = Awaited<ReturnType<typeof getGroup>>;
export function getGroup(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db.select()
    .from(groups)
    .where(eq(groups.id, groupID))
    .leftJoin(userInGroups, eq(userInGroups.groupId, groups.id))
    .leftJoin(categoriesInGroup, eq(categoriesInGroup.groupId, groups.id))
    .limit(1)
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

export type User = Awaited<ReturnType<typeof getUser>>
export function getUser(userId: string) {
  UUIDVerifier.parse(userId)
  return db.select().from(users).where(eq(users.id, userId)).limit(1)
}

const UpdateUsernameSchema = z.object({
  username: z.string().max(64).min(3),
  userID: z.string().uuid()
})
export type UpdateUsername = { username: string, userID: string }
export function updateUsername(update: UpdateUsername) {
  UpdateUsernameSchema.parse(update)
  return db.update(users)
    .set({ name: update.username })
    .where(eq(users.id, update.userID))
    .returning()
}

export type Group = Awaited<ReturnType<typeof getGroupsFromUser>>
export function getGroupsFromUser(userId: string) {
  UUIDVerifier.parse(userId)
  return db.select().from(userInGroups)
    .where(eq(userInGroups.userId, userId))
    .leftJoin(groups, eq(groups.id, userInGroups.groupId))
}

export type UserCategories = Awaited<ReturnType<typeof getUserCategories>>;
export function getUserCategories(userId: string) {
  return db.selectDistinctOn([categories.id]).from(categories)
    .where(eq(users.id, userId))
    .leftJoin(categoriesInGroup, eq(categories.id, categoriesInGroup.categoryId))
    .leftJoin(groups, eq(groups.id, categoriesInGroup.groupId))
    .leftJoin(userInGroups, eq(groups.id, userInGroups.groupId))
    .leftJoin(users, eq(users.id, userInGroups.userId))
}


export type DefaultCategories = Awaited<ReturnType<typeof getDefaultCategories>>;
export function getDefaultCategories() {
  return db.selectDistinct().from(categories)
    .where(eq(categories.default, true))
    .orderBy(asc(categories.position))
}

const insertVoteSchema = createInsertSchema(votes);
export type Vote = typeof votes.$inferInsert
export function createVote(newVote: Vote) {
  insertVoteSchema.parse(newVote)
  return db.insert(votes)
    .values(newVote)
    .onConflictDoUpdate({
      target: [votes.categories, votes.userID, votes.actID],
      set: { points: newVote.points }
    })
    .returning().execute()
}

export type VotesForActByUser = Awaited<ReturnType<typeof getVoteForActByUser>>;
export function getVoteForActByUser(userId: string, actId: string) {
  return db.select({ points: votes.points, categories: votes.categories }).from(votes)
    .where(and(eq(votes.userID, userId), eq(votes.actID, actId)))
}

export type AdjacentActs = Awaited<ReturnType<typeof getAdjacentActs>>;
export function getAdjacentActs(actPosition: number) {
  return db.select().from(acts)
    .where(
      or(
        eq(acts.position, actPosition - 1),
        eq(acts.position, actPosition + 1)
      ))
    .orderBy(asc(acts.position))
    .limit(2)
}

export type TopActs = Awaited<ReturnType<typeof getCurrentTopActs>>
export function getCurrentTopActs(limit: number, offset: number) {
  return db.select(
    {
      actID: acts.id,
      title: acts.title,
      artist: acts.artist,
      countryName: countries.name,
      countryImage: countries.imageURL,
      averagePoints: sql<number>`cast(avg(${votes.points}) AS DECIMAL(10,2))`
    })
    .from(acts)
    .leftJoin(votes, eq(votes.actID, acts.id))
    .leftJoin(categories, eq(categories.id, votes.categories))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .where(like(categories.name, 'song'))
    .groupBy(acts.id, countries.name, countries.imageURL)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(sql<number>`avg(${votes.points})`))
}

// Drinks

export type DrinkList = Awaited<ReturnType<typeof getDrinks>>
export function getDrinks() {
  return db.select().from(drinks).leftJoin(countries, eq(countries.id, drinks.countryID))
}

export type Drink = Awaited<ReturnType<typeof getDrink>>
export function getDrink(drinkID: string) {
  UUIDVerifier.parse(drinkID)
  return db.select().from(drinks).where(eq(drinks.id, drinkID))
}

export type NewDrink = typeof drinks.$inferInsert
export function createDrink(newDrink: NewDrink) {
  return db.insert(drinks).values(newDrink).execute()
}


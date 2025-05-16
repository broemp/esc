import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { groups, userInGroups, categoriesInGroup, votes, acts, countries, categories, users } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from "zod";
import type { Group, NewGroup, NewUserInGroup } from '../../../types';

const UUIDVerifier = z.string().uuid();
const JoinGroupSchema = createInsertSchema(userInGroups);

export function createGroup(group: NewGroup) {
  return db.insert(groups).values(group).returning({ id: groups.id });
}

export function getPublicGroups(limit: number, offset: number) {
  return db.select({
    id: groups.id,
    name: groups.name,
    public: groups.public,
    memberCount: sql<number>`count(${userInGroups.userId})`
  })
    .from(groups)
    .where(eq(groups.public, true))
    .leftJoin(userInGroups, eq(groups.id, userInGroups.groupId))
    .groupBy(groups.id, groups.name, groups.public)
    .orderBy(desc(sql<number>`count(${userInGroups.userId})`))
    .limit(4)
}

export function addUserToGroup(groupID: string, userID: string) {
  return db.insert(userInGroups).values({ groupId: groupID, userId: userID }).execute();
}

export function getMembersOfGroup(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db
    .select({ username: users.name, userid: users.id })
    .from(groups)
    .where(eq(groups.id, groupID))
    .leftJoin(userInGroups, eq(groups.id, userInGroups.groupId))
    .leftJoin(users, eq(users.id, userInGroups.userId));
}

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

export function getGroup(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db.select()
    .from(groups)
    .where(eq(groups.id, groupID))
    .leftJoin(userInGroups, eq(userInGroups.groupId, groups.id))
    .leftJoin(categoriesInGroup, eq(categoriesInGroup.groupId, groups.id))
    .limit(1)
}

export function joinGroup(join: NewUserInGroup) {
  JoinGroupSchema.parse(join);
  return db
    .insert(userInGroups)
    .values({ groupId: join.groupId, userId: join.userId })
    .onConflictDoNothing()
    .execute();
}

export function getGroupsFromUser(userId: string) {
  UUIDVerifier.parse(userId)
  return db.select().from(userInGroups)
    .where(eq(userInGroups.userId, userId))
    .leftJoin(groups, eq(groups.id, userInGroups.groupId))
}

export function leaveGroup(groupId: string, userId: string) {
  UUIDVerifier.parse(groupId);
  UUIDVerifier.parse(userId);
  return db
    .delete(userInGroups)
    .where(and(eq(userInGroups.groupId, groupId), eq(userInGroups.userId, userId)))
    .execute();
}

export function getOverallRankingGroup(groupID: string) {
  UUIDVerifier.parse(groupID)
  return db
    .select({
      actID: acts.id,
      artist: acts.artist,
      title: acts.title,
      countryImage: countries.imageURL,
      score: sql<number>`cast(avg(${votes.points}) AS DECIMAL(10,2))`
    })
    .from(votes)
    .where(eq(votes.userID, userInGroups.userId))
    .leftJoin(userInGroups, eq(userInGroups.groupId, groupID))
    .leftJoin(acts, eq(acts.id, votes.actID))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .groupBy(acts.id, acts.artist, acts.title, countries.imageURL)
    .orderBy(desc(sql<number>`avg(${votes.points})`))
} 
import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../schema';
import { z } from "zod";
import type { UpdateUsername } from '../../../types';

const UUIDVerifier = z.string().uuid();
const UpdateUsernameSchema = z.object({
  username: z.string().max(64).min(3),
  userID: z.string().uuid()
})

export function getUser(userId: string) {
  UUIDVerifier.parse(userId)
  return db.select().from(users).where(eq(users.id, userId)).limit(1)
}

export function updateUsername(update: UpdateUsername) {
  UpdateUsernameSchema.parse(update)
  return db.update(users)
    .set({ name: update.username })
    .where(eq(users.id, update.userID))
    .returning()
}

export function getAllUsers(limit: number = 10, offset: number = 0) {
  return db.select().from(users).orderBy(users.createdAt).limit(limit).offset(offset);
}

export function updateUserRole(userId: string, role: string) {
  return db.update(users).set({ role }).where(eq(users.id, userId)).returning();
}

export function getTotalUsersCount() {
  return db.select({ count: sql<number>`count(*)` }).from(users);
} 
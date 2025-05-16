import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { categories, categoriesInGroup, userInGroups } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import type { Category, NewCategory } from '../../../types';

export function newCategory(category: NewCategory) {
  return db.insert(categories).values(category);
}

export function addCategorieToGroup(name: string, groupID: string) {
  return db.transaction(async (tx) => {
    let categorie = await tx
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, name));
    
    if (categorie.length == 0) {
      categorie = await tx.insert(categories).values({ name: name }).returning();
    }

    return tx.insert(categoriesInGroup).values({ groupId: groupID, categoryId: categorie[0].id });
  });
}

export function getGroupCategories(groupID: string) {
  return db
    .select()
    .from(categoriesInGroup)
    .where(eq(categoriesInGroup.groupId, groupID))
    .leftJoin(categories, eq(categories.id, categoriesInGroup.categoryId))
    .orderBy(asc(categories.position));
}

export function getDefaultCategories() {
  return db.select().from(categories).where(eq(categories.default, true));
}

export function getAllCategories() {
  return db.select().from(categories)
    .orderBy(asc(categories.position));
}

export function updateCategory(category: Category) {
  return db.update(categories)
    .set(category)
    .where(eq(categories.id, category.id))
    .returning();
}

export function deleteCategory(categoryId: string) {
  return db.delete(categories)
    .where(eq(categories.id, categoryId))
    .returning();
}

export function getTotalCategoriesCount() {
  return db.select({ count: sql<number>`count(*)` }).from(categories);
}

export function getUserCategories(userId: string) {
  return db.selectDistinctOn([categories.id]).from(categories)
    .leftJoin(categoriesInGroup, eq(categories.id, categoriesInGroup.categoryId))
    .leftJoin(userInGroups, eq(categoriesInGroup.groupId, userInGroups.groupId))
    .where(eq(userInGroups.userId, userId));
} 
import { asc, eq } from 'drizzle-orm';
import { db } from '../db';
import { drinks, countries } from '../schema';
import type { NewDrink } from '../../../types';

export function getDrinks() {
  return db.select().from(drinks).leftJoin(countries, eq(drinks.countryID, countries.id));
}

export function getDrink(drinkID: string) {
  return db.select().from(drinks).where(eq(drinks.id, drinkID)).leftJoin(countries, eq(drinks.countryID, countries.id)).limit(1);
}

export function createDrink(newDrink: NewDrink) {
  return db.insert(drinks).values(newDrink).onConflictDoNothing().execute();
}

export function getOldestDrinkYear() {
  return db.select({ year: drinks.year })
    .from(drinks)
    .orderBy(asc(drinks.year))
    .limit(1);
} 
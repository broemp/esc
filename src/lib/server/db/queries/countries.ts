import { db } from '../db';
import { countries } from '../schema';
import type { NewCountry } from '../../../types';

export function listCountries(limit: number, offset: number) {
  return db.select().from(countries).limit(limit).offset(offset);
}

export function createCountry(country: NewCountry) {
  return db.insert(countries).values(country).onConflictDoNothing().execute();
} 
import { createAct, createCountry, listCountries, type NewAct } from '$lib/server/db/queries';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { Actions, RequestEvent } from './$types';
import { z } from 'zod';

export const load: PageServerLoad = async () => {
  const countries = await listCountries(100, 0);
  return {
    countries: countries
  };
};

const countrySchema = z.object({
  name: z.string(),
  code: z.string().max(4)
});

const actSchema = z.object({
  countryID: z.string().uuid(),
  artist: z.string(),
  title: z.string(),
  year: z.number()
});

export const actions = {
  act: async (event: RequestEvent) => {
    const data = await event.request.formData();
    let date = new Date();
    let act: NewAct = {
      position: data.has("position") ? +data.get("position")?.toString()! : null,
      countryID: data.get('country_id')?.toString()!,
      artist: data.get('artist')?.toString()!,
      title: data.get('title')?.toString()!,
      picture_url: data.get('picture_url')?.toString()!,
      year: date.getFullYear()
    };

    try {
      actSchema.parse(act);
    } catch (e) {
      return fail(400, { success: false, message: 'Invalid Data, ' + e });
    }
    try {
      createAct(act);
    } catch (e) {
      return fail(500, { message: 'Could not create database entry, ' + e });
    }
    return { success: true, message: "" };
  },
  country: async (event: RequestEvent) => {
    const data = await event.request.formData();
    let country = {
      name: data.get('name')?.toString()!,
      code: data.get('code')?.toString()!,
      imageURL: data.get('image')?.toString()
    };
    try {
      countrySchema.parse(country);
    } catch (e) {
      return fail(400, { success: false, message: 'Invalid Data, ' + e });
    }
    try {
      createCountry(country);
    } catch (e) {
      return fail(500, { message: 'Could not create database entry, ' + e });
    }
    return { success: true, message: "" };
  }
} satisfies Actions;

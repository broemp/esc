import { z } from "zod";
import type { RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";
import { createDrink, listCountries, type NewDrink } from "$lib/server/db/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const countries = await listCountries(100, 0);
  return {
    countries: countries
  };
};

const DrinkSchema = z.object({
  name: z.string(),
  countryID: z.string().uuid(),
  percentage: z.number().min(0).max(100).int().optional(),
  alcohol: z.boolean(),
  year: z.number().int().min(2020).max(2030)
});

export const actions = {
  drinks: async (event: RequestEvent) => {
    const data = await event.request.formData();
    let date = new Date();
    let drink: NewDrink = {
      countryID: data.get('country_id')?.toString()!,
      name: data.get('name')?.toString()!,
      percentage: +data.get('percentage')?.toString()!,
      alcohol: data.has("alcoholic"),
      year: date.getFullYear()
    };

    try {
      DrinkSchema.parse(drink);
    } catch (e) {
      return fail(400, { success: false, message: 'Invalid Data, ' + e });
    }
    try {
      createDrink(drink);
    } catch (e) {
      return fail(500, { message: 'Could not create database entry, ' + e });
    }
    return { success: true, message: "" };

  }
}

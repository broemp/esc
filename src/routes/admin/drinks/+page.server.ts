import { getDrinks, listCountries } from "$lib/server/db/querys";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const drinks = getDrinks()
  const countries = listCountries(100, 0);

  return {
    drinks: await drinks,
    countries: await countries
  }
}

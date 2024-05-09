import type { PageServerLoad } from './$types';
import { listActs, listCountries } from '$lib/server/db/querys';

export const load: PageServerLoad = async () => {
  const acts = await listActs(100, 0);
  const countries = await listCountries(100, 0);
  return {
    acts: acts,
    countries: countries
  };
};

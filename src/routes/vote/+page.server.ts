import type { PageServerLoad } from './$types';
import { listActs, listCountries, nextAdminAct } from '$lib/server/db/querys';

export const load: PageServerLoad = async () => {
  const acts = listActs(30, 0);
  const countries = listCountries(30, 0);
  const propablyNextAct = nextAdminAct()

  return {
    acts: await acts,
    countries: await countries,
    nextAct: await propablyNextAct
  };
};

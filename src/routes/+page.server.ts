import { getCurrentTopActs, listActs } from '$lib/server/db/querys';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  let acts = listActs(40, 0);
  let topActs = getCurrentTopActs(10, 0)
  return {
    acts: await acts,
    topActs: await topActs
  };
};

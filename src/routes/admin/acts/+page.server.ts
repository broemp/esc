import { listActs } from "$lib/server/db/querys";
import type { PageServerLoad } from "./$types";
import type { Actions } from './$types';

export const load: PageServerLoad = async () => {
  const acts = await listActs(100, 0);
  return {
    acts: acts
  };
}

export const actions = {
  default: async ({ request }) => {
    console.log("submit" + request.formData())
  },
} satisfies Actions;

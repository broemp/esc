import { deleteAct, listActs, listCountries, updateAct, type UpdateAct } from '$lib/server/db/querys';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async () => {
  const acts = await listActs(100, 0);
  const countries = await listCountries(100, 0);
  return {
    acts: acts,
    countries: countries
  };
};

export const actions = {
  update: async ({ request }) => {
    const data = await request.formData();
    let act: UpdateAct = {
      id: data.get('act_id')?.toString()!,
      countryID: data.get('country_id')?.toString()!,
      artist: data.get('artist')?.toString()!,
      title: data.get('title')?.toString()!,
      year: +data.get('year')?.toString()!,
      position: +data.get('position')?.toString()!,
      endpoints: +data.get('endpoints')?.toString()!,
      picture_url: data.get("picture_url")?.toString()!,
      eliminated: data.get('eliminated')?.toString().toLowerCase() == 'true'
    };
    let res;
    try {
      res = await updateAct(act);
    } catch (e) {
      return { success: false }
    }
    return { success: true, act: res };
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    try {
      await deleteAct(data.get("act_id")?.toString()!)
    } catch (e) {
      return { success: false, error: e }
    }
    return { success: true }
  },
} satisfies Actions;

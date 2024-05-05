import { listActs, listCountries, updateAct, type UpdateAct } from '$lib/server/db/querys';
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
	default: async ({ request }) => {
		const data = await request.formData();
		let act: UpdateAct = {
			id: data.get('act_id')?.toString()!,
			countryID: data.get('country_id')?.toString()!,
			artist: data.get('artist')?.toString()!,
			title: data.get('title')?.toString()!,
			year: +data.get('year')?.toString()!,
			position: +data.get('position')?.toString()!,
			endpoints: +data.get('endpoints')?.toString()!,
			eliminated: data.get('eliminated')?.toString().toLowerCase() == 'true'
		};
		let res = await updateAct(act);
		return { success: true, act: res };
	}
} satisfies Actions;

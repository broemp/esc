import { listActs } from '$lib/server/db/querys';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	let acts = listActs(40, 0);
	return {
		acts: await acts
	};
};

import { getGroup, type GroupInfo } from '$lib/server/db/querys';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }: any) => {
	const group: GroupInfo = await getGroup(params.id);

	return {
		slug: params.id,
		group: group[0]
	};
};

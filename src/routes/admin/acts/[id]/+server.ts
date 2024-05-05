import { json } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { getAct } from '$lib/server/db/querys';

export async function GET(event: RequestEvent) {
	const { params } = event;
	const { id } = params;
	const act = await getAct(id);
	return json(act);
}

import { getOldestDrinkYear } from '$lib/server/db/queries';
import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	const session = await event.locals.auth();
	if (!session?.user || session.user.role !== 'admin') {
		throw error(403, 'Not authorized');
	}
	const oldestYear = await getOldestDrinkYear();
	return json(oldestYear[0] || { year: new Date().getFullYear() });
} 
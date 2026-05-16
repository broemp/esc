import { getDrinks } from '$lib/server/db/queries';
import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	const session = await event.locals.auth();
	if (!session?.user || session.user.role !== 'admin') {
		throw error(403, 'Not authorized');
	}
	const drinks = await getDrinks();
	return json(drinks);
}
import { getOldestDrinkYear } from '$lib/server/db/queries';
import { json } from '@sveltejs/kit';

export async function GET() {
	const oldestYear = await getOldestDrinkYear();
	return json(oldestYear[0] || { year: new Date().getFullYear() });
} 
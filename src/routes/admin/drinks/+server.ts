import { getDrinks } from '$lib/server/db/queries';
import { json } from '@sveltejs/kit';

export async function GET() {
	const drinks = await getDrinks();
	return json(drinks);
}

// This file can be used for other drink-related endpoints if needed 
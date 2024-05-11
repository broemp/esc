import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { getDrink } from '$lib/server/db/querys';

export async function GET(event: RequestEvent) {
  const id = event.params.id;
  const drink = await getDrink(id);
  return json(drink);
}

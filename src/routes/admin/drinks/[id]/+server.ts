import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { getDrink } from '$lib/server/db/queries';

export async function GET(event: RequestEvent) {
  const session = await event.locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }
  const id = event.params.id;
  const drink = await getDrink(id);
  return json(drink);
}

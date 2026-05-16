import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { getAct } from '$lib/server/db/queries';

export async function GET(event: RequestEvent) {
  const session = await event.locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }
  const id = event.params.id;
  const act = await getAct(id);
  return json(act);
}

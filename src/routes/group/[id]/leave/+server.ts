import { leaveGroup } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (request: RequestEvent) => {
  const session = await request.locals.auth();
  const userID = session?.user?.id;
  
  if (!userID || !request.params.id) {
    return new Response(JSON.stringify('error'), { status: 400 });
  }

  await leaveGroup(request.params.id, userID);
  return redirect(303, '/group');
}; 
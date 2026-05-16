import { getGroupsFromUser, getPublicGroups } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let session = await event.locals.auth()

  if (!session?.user) {
    return redirect(303, "/")
  }

  const [groups, publicGroups] = await Promise.all([
    getGroupsFromUser(session.user.id!),
    getPublicGroups(6, 0),
  ]);

  return { groups, publicGroups };
};

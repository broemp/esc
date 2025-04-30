import { getGroupsFromUser } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let session = await event.locals.auth()

  if (!session?.user) {
    return redirect(303, "/")
  }

  let groups = await getGroupsFromUser(session.user?.id!)

  return {
    groups: groups
  };
};

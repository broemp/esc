import { getGroup, getMembersOfGroup } from '$lib/server/db/querys';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let session = await event.locals.auth()
  if (!session) {
    return redirect(303, "/")
  }
  const group = await getGroup(event.params.id!)
  const members = await getMembersOfGroup(event.params.id!)

  let isAdmin = false
  if (group[0].group.admin == session.user?.id) {
    isAdmin = true
  }
  return {
    group: group[0],
    members: members,
    isAdmin: isAdmin,
  };
};

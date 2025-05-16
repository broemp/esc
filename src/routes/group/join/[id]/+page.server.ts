import { getGroup, getGroupsFromUser, type GroupInfo } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user?.id) {
    return redirect(303, "/");
  }

  // Check if user is already in the group
  const userGroups = await getGroupsFromUser(session.user.id);
  const isAlreadyInGroup = userGroups.some(group => group.group?.id === params.id);
  
  if (isAlreadyInGroup) {
    return redirect(303, "/group/" + params.id);
  }

  const result = await getGroup(params.id);
  const group: GroupInfo = {
    id: result[0].group.id,
    name: result[0].group.name,
    public: result[0].group.public,
    members: [],
    categories: []
  };

  return {
    group: { group }
  };
};

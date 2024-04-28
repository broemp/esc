import { db } from '$lib/server/db/db';
import { getGroup, joinGroup, type GroupInfo } from '$lib/server/db/querys';
import { userInGroups } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { Actions } from '../../[id]/$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }: any) => {
  const group: GroupInfo = await getGroup(params.id)

  return {
    slug: params.id,
    group: group
  }
}

export const actions: Actions = {
  default: async (event) => {
    const user = await event.locals.auth()
    const userID = user?.user?.id
    if (!user) {
      return redirect(303, "/")
    }
    joinGroup(event.params.id, userID!)
  }
}

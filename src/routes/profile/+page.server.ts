import { getUser, updateUsername } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent, Actions } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let session = await event.locals.auth()

  if (!session?.user) {
    return redirect(303, "/")
  }

  let userData = await getUser(session.user?.id!)

  return {
    user: userData[0]
  };
};

export const actions = {
  default: async (event: RequestEvent) => {
    const data = await event.request.formData();
    let session = await event.locals.auth()
    if (!session) {
      return { success: false }
    }

    let user = await updateUsername({
      userID: session.user?.id!,
      username: data.get("username")?.toString()!
    })

    return {
      success: true,
      user: user[0]
    }
  }
} satisfies Actions; 
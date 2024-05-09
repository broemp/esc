import { getUser } from '$lib/server/db/querys';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';

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

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  let session = await event.locals.auth()
  if (!session) {
    return redirect(303, "/")
  }

  if (session.user?.role != 'admin') {
    return redirect(303, "/")
  }
}

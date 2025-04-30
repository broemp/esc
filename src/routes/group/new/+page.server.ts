import {
  addCategorieToGroup,
  addUserToGroup,
  createGroup,
  type CreatedGroup,
  type NewGroup
} from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../../admin/acts/$types';

export const actions = {
  default: async (event: RequestEvent) => {
    const data = await event.request.formData();
    const session = await event.locals.auth();

    if (!session?.user) {
      return { success: false, error: 'Not logged in' };
    }

    let newGroup: NewGroup = {
      name: data.get('name')!.valueOf().toString(),
      admin: session.user.id!,
      public: data.has("public")
    };

    let group: CreatedGroup = await createGroup(newGroup);

    // FIX: Adding Categories
    // Users can add arbitrary categories with post request
    data.forEach(async (_, key) => {
      if (key != 'name' && key != 'description' && key != 'public') {
        await addCategorieToGroup(key.toString(), group[0].id);
      }
    });

    addUserToGroup(group[0].id, session.user.id!);

    return redirect(303, '/group/' + group[0].id);
  }
};

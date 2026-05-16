import {
  linkCategoryToGroup,
  addUserToGroup,
  createGroup,
  getAllCategories,
  type NewGroup
} from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const UUIDSchema = z.string().uuid();

export const load: PageServerLoad = async () => {
  const categories = await getAllCategories();
  return { categories };
};

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const session = await event.locals.auth();

    if (!session?.user) {
      return { success: false, error: 'Not logged in' };
    }

    const name = data.get('name')?.toString().trim();
    if (!name) {
      return { success: false, error: 'Group name is required' };
    }

    let newGroup: NewGroup = {
      name: name,
      admin: session.user.id!,
      public: data.has("public")
    };

    const group = await createGroup(newGroup);

    for (const [key] of data) {
      if (key !== 'name' && key !== 'description' && key !== 'public') {
        if (UUIDSchema.safeParse(key).success) {
          await linkCategoryToGroup(key, group[0].id);
        }
      }
    }

    addUserToGroup(group[0].id, session.user.id!);

    return redirect(303, '/group/' + group[0].id);
  }
};

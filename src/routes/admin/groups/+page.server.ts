import { db } from '$lib/server/db/db';
import { groups, userInGroups, categoriesInGroup } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const allGroups = await db.select().from(groups).execute();
  return {
    groups: allGroups
  };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user || session.user.role !== 'admin') {
      throw error(403, 'Not authorized');
    }

    const formData = await request.formData();
    const groupId = formData.get('groupId')?.toString();

    if (!groupId) {
      throw error(400, 'Group ID is required');
    }

    try {
      // Delete related records first
      await db.delete(userInGroups).where(eq(userInGroups.groupId, groupId)).execute();
      await db.delete(categoriesInGroup).where(eq(categoriesInGroup.groupId, groupId)).execute();
      
      // Finally delete the group
      await db.delete(groups).where(eq(groups.id, groupId)).execute();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting group:', err);
      throw error(500, 'Failed to delete group');
    }
  }
}; 
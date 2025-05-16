import { db } from '$lib/server/db/db';
import { groups } from '$lib/server/db/schema';
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

    await db.delete(groups).where(eq(groups.id, groupId)).execute();
    return { success: true };
  }
}; 
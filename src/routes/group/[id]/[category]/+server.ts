import { getRankingCategoryGroup, getGroup, getMembersOfGroup } from "$lib/server/db/queries";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function GET(request: RequestEvent) {
  const session = await request.locals.auth()
  if (!session?.user) {
    throw error(403, 'Not authorized');
  }

  const group = await getGroup(request.params.id);
  if (!group[0]) {
    throw error(404, 'Group not found');
  }

  if (!group[0].group.public) {
    const members = await getMembersOfGroup(request.params.id);
    const isMember = members.some(m => m.userid === session.user?.id);
    if (!isMember) {
      throw error(403, 'Not authorized');
    }
  }

  const ranking = await getRankingCategoryGroup(request.params.id, request.params.category);

  return json({ ranking });
}

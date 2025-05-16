import { getGroup, getGroupCategories, getGroupSongVotes, getMembersOfGroup, getRankingCategoryGroup, getOverallRankingGroup, type RankingCategoryGroup } from '$lib/server/db/queries';
import { redirect, error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let session = await event.locals.auth()
  if (!session) {
    return redirect(303, "/")
  }

  const groupID = event.params.id!

  const group = await getGroup(groupID)
  if (!group[0]) {
    throw error(404, 'Group not found');
  }

  // Check if user has access to the group
  const members = await getMembersOfGroup(groupID)
  const isMember = members.some(member => member.userid === session.user?.id);
  const isPublic = group[0].group.public;

  if (!isMember && !isPublic) {
    throw error(403, 'Not authorized to access this group');
  }

  const categories = await getGroupCategories(groupID)
  const songVotes = await getGroupSongVotes(groupID)
  const overallRanking = await getOverallRankingGroup(groupID)
  const categoryRanking: RankingCategoryGroup[] = [];

  categories.forEach(async (cat) => {
    let ranking = await getRankingCategoryGroup(groupID, cat.category?.id!)
    if (ranking.length > 0) {
      categoryRanking.push(ranking)
    }
  });

  let isAdmin = false
  if (group[0].group.admin == session.user?.id) {
    isAdmin = true
  }
  return {
    group: group[0],
    members: members,
    categories: categories,
    songVotes: songVotes,
    categoryRanking: categoryRanking,
    overallRanking: overallRanking,
    isAdmin: isAdmin,
  };
};

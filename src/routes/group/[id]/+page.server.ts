import { getGroup, getGroupCategories, getGroupSongVotes, getMembersOfGroup, getRankingCategoryGroup, type RankingCategoryGroup, type aRankingCategoryGroup } from '$lib/server/db/querys';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let session = await event.locals.auth()
  if (!session) {
    return redirect(303, "/")
  }

  const groupID = event.params.id!

  const group = await getGroup(groupID)
  const members = await getMembersOfGroup(groupID)
  const categories = await getGroupCategories(groupID)
  const songVotes = await getGroupSongVotes(groupID)
  const categoryRanking: RankingCategoryGroup[] = [];

  categories.forEach(async (cat) => {
    let ranking = await getRankingCategoryGroup(groupID, cat.category?.id!)
    if (ranking.length > 0) {
      categoryRanking.push(ranking)
    }
  });

  console.log("yes: ", categoryRanking)
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
    isAdmin: isAdmin,
  };
};

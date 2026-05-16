import { getGroup, getGroupCategories, getGroupSongVotes, getMembersOfGroup, getRankingCategoryGroup, getOverallRankingGroup, getControversialActs, getAgreedActs, getVoterProfiles, type RankingCategoryGroup } from '$lib/server/db/queries';
import { getCachedStats, setCachedStats } from '$lib/server/statsCache';
import { redirect, error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type GroupStatsData = {
  controversial: Awaited<ReturnType<typeof getControversialActs>>;
  agreed: Awaited<ReturnType<typeof getAgreedActs>>;
  voterProfiles: Awaited<ReturnType<typeof getVoterProfiles>>;
};

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
  const cacheKey = `group-stats-${groupID}`;
  const cached = getCachedStats<GroupStatsData>(cacheKey);

  let groupStats: GroupStatsData;
  let statsUpdatedAt: number;

  const [songVotes, overallRanking] = await Promise.all([
    getGroupSongVotes(groupID),
    getOverallRankingGroup(groupID),
  ]);

  if (cached) {
    groupStats = cached.data;
    statsUpdatedAt = cached.ts;
  } else {
    const [controversial, agreed, voterProfiles] = await Promise.all([
      getControversialActs(groupID, 3),
      getAgreedActs(groupID, 3),
      getVoterProfiles(groupID),
    ]);
    groupStats = { controversial, agreed, voterProfiles };
    statsUpdatedAt = setCachedStats(cacheKey, groupStats);
  }
  const categoryRankingResults = await Promise.all(
    categories.map((cat) => getRankingCategoryGroup(groupID, cat.category?.id!))
  );
  const categoryRanking: RankingCategoryGroup[] = categoryRankingResults.filter(
    (r) => r.length > 0
  );

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
    groupStats,
    statsUpdatedAt,
  };
};

import type { PageServerLoad } from './$types';
import {
  getControversialActs,
  getAgreedActs,
  getVoterProfiles,
  getUserSimilarity,
  getUserDeviationFromGroup,
  getUserStats,
  getPublicGroups,
  getGroupsFromUser,
  isStatsEnabled,
} from '$lib/server/db/queries';
import { z } from 'zod';

const UUIDSchema = z.string().uuid();

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();
  const userId = session?.user?.id ?? null;

  const enabled = await isStatsEnabled();
  if (!enabled) {
    return {
      disabled: true,
      groupId: null,
      groups: [],
      controversial: [],
      agreed: [],
      voterProfiles: [],
      similarity: [],
      deviation: [],
      userStats: null,
      userId,
    };
  }

  const rawGroup = event.url.searchParams.get('group');
  const groupId = rawGroup && UUIDSchema.safeParse(rawGroup).success ? rawGroup : null;

  const publicGroupsRaw = await getPublicGroups(20, 0);

  let userGroupIds: string[] = [];
  if (userId) {
    const userGroupsRaw = await getGroupsFromUser(userId);
    userGroupIds = userGroupsRaw
      .map((r) => r.group?.id)
      .filter((id): id is string => !!id);
  }

  const allGroupIds = new Set([
    ...publicGroupsRaw.map((g) => g.id),
    ...userGroupIds,
  ]);
  const groups = publicGroupsRaw.filter((g) => allGroupIds.has(g.id));

  const [controversial, agreed, voterProfiles, similarity, deviation, userStats] =
    await Promise.all([
      getControversialActs(groupId, 5),
      getAgreedActs(groupId, 5),
      getVoterProfiles(groupId),
      getUserSimilarity(groupId),
      getUserDeviationFromGroup(groupId),
      userId ? getUserStats(userId) : null,
    ]);

  return {
    disabled: false,
    groupId,
    groups,
    controversial,
    agreed,
    voterProfiles,
    similarity,
    deviation,
    userStats,
    userId,
  };
};

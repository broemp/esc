import type { PageServerLoad } from './$types';
import {
  getControversialActs,
  getAgreedActs,
  getVoterProfiles,
  getUserMostAlike,
  getUserMostDifferent,
  getUserDeviationFromGroup,
  getUserStats,
  getPublicGroups,
  getGroupsFromUser,
  isStatsEnabled,
  isVotingLocked,
  getActiveYear,
} from '$lib/server/db/queries';
import { z } from 'zod';

const UUIDSchema = z.string().uuid();

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();
  const userId = session?.user?.id ?? null;

  const [enabled, locked, year] = await Promise.all([
    isStatsEnabled(),
    isVotingLocked(),
    getActiveYear(),
  ]);

  if (!enabled) {
    return {
      disabled: true,
      votingLocked: locked,
      activeYear: year,
      groupId: null,
      groups: [],
      controversial: [],
      agreed: [],
      voterProfiles: [],
      mostAlike: [],
      mostDifferent: [],
      deviation: [],
      userStats: null,
      userId,
    };
  }

  const rawGroup = event.url.searchParams.get('group');
  const groupId = rawGroup && UUIDSchema.safeParse(rawGroup).success ? rawGroup : null;

  const publicGroupsRaw = await getPublicGroups(20, 0);
  const publicGroups = publicGroupsRaw.filter((g) => !g.isDefault);

  let privateGroups: { id: string; name: string; public: boolean; memberCount: number; isDefault: boolean }[] = [];
  if (userId) {
    const userGroupsRaw = await getGroupsFromUser(userId);
    const publicGroupIds = new Set(publicGroups.map((g) => g.id));
    privateGroups = userGroupsRaw
      .filter((r) => r.group && !r.group.isDefault && !publicGroupIds.has(r.group.id))
      .map((r) => ({
        id: r.group!.id,
        name: r.group!.name,
        public: r.group!.public,
        isDefault: r.group!.isDefault,
        memberCount: 0,
      }));
  }

  const groups = [...publicGroups, ...privateGroups];

  const [controversial, agreed, voterProfiles, mostAlike, mostDifferent, deviation, userStats] =
    await Promise.all([
      getControversialActs(groupId, 5, year),
      getAgreedActs(groupId, 5, year),
      getVoterProfiles(groupId, year),
      userId ? getUserMostAlike(userId, groupId, 3, year) : Promise.resolve([]),
      userId ? getUserMostDifferent(userId, groupId, 3, year) : Promise.resolve([]),
      getUserDeviationFromGroup(groupId, year),
      userId ? getUserStats(userId, year) : null,
    ]);

  return {
    disabled: false,
    votingLocked: locked,
    activeYear: year,
    groupId,
    groups,
    controversial,
    agreed,
    voterProfiles,
    mostAlike,
    mostDifferent,
    deviation,
    userStats,
    userId,
  };
};

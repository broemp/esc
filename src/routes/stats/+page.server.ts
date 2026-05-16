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

  // Exclude the default "Everybody" group — represented by the hardcoded "Everyone" option
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
      getControversialActs(groupId, 5),
      getAgreedActs(groupId, 5),
      getVoterProfiles(groupId),
      userId ? getUserMostAlike(userId, groupId, 3) : Promise.resolve([]),
      userId ? getUserMostDifferent(userId, groupId, 3) : Promise.resolve([]),
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
    mostAlike,
    mostDifferent,
    deviation,
    userStats,
    userId,
  };
};

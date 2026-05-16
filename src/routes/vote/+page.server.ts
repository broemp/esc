import type { PageServerLoad } from './$types';
import { listActs, listCountries, nextAdminAct, getVotedActsByUser } from '$lib/server/db/queries';
import type { RequestEvent } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const session = await event.locals.auth();
  const acts = listActs(30, 0);
  const countries = listCountries(30, 0);
  const propablyNextAct = nextAdminAct();

  let votedActIds: string[] = [];
  if (session?.user?.id) {
    const voted = await getVotedActsByUser(session.user.id);
    votedActIds = voted.map(v => v.actID);
  }

  return {
    acts: await acts,
    countries: await countries,
    nextAct: await propablyNextAct,
    votedActIds
  };
};

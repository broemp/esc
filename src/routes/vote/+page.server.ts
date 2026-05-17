import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from './$types';
import {
  listActs,
  listCountries,
  nextAdminAct,
  getVotedActsByUser,
  isVotingLocked,
  getActiveYear,
} from '$lib/server/db/queries';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const [locked, year] = await Promise.all([isVotingLocked(), getActiveYear()]);

  if (locked) {
    redirect(303, '/stats');
  }

  const session = await event.locals.auth();
  const acts = listActs(30, 0, year);
  const countries = listCountries(30, 0);
  const propablyNextAct = nextAdminAct(year);

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

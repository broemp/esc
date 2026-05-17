import {
  createVote,
  getAct,
  getAdjacentActs,
  getDefaultCategories,
  getUserCategories,
  getVoteForActByUser,
  isVotingLocked,
  getActiveYear,
  type AdjacentActs,
  type DefaultCategories,
  type UserCategories,
  type Vote,
  type VotesForActByUser
} from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const session = await event.locals.auth();
  if (!session?.user) {
    return redirect(403, "/")
  }

  const [locked, year] = await Promise.all([isVotingLocked(), getActiveYear()]);

  let adjacentActs: AdjacentActs | undefined;
  const act = await getAct(event.params.id);
  let categories: UserCategories | DefaultCategories = await getUserCategories(session.user.id!);
  const votesByUser: VotesForActByUser = await getVoteForActByUser(session.user.id!, event.params.id)

  if (categories.length == 0) {
    categories = await getDefaultCategories()
  }

  if (act[0].act.position) {
    adjacentActs = await getAdjacentActs(act[0].act.position, year)
  }

  return {
    act,
    categories,
    votes: votesByUser,
    adjacentActs,
    votingLocked: locked,
  }
};

export const actions = {
  vote: async (event: RequestEvent) => {
    const session = await event.locals.auth();
    if (!session?.user) {
      return { success: false, message: "Not Authorized" }
    }

    if (await isVotingLocked()) {
      return { success: false, message: "Voting is locked" }
    }

    const formData = await event.request.formData()
    const userID = session.user.id

    const points = Number(formData.get("points"));
    if (!Number.isFinite(points) || points < 0 || points > 10 || (points * 2) % 1 !== 0) {
      return { success: false, message: "Invalid points value" }
    }

    let newVote: Vote = {
      userID: userID!,
      actID: event.params.id,
      categories: formData.get("categorie_id")?.toString()!,
      points: points.toString()
    }

    try {
      createVote(newVote)
    } catch (e) {
      return { success: false, message: "Failed to update categorie" }
    }
    return { success: true }
  }
} satisfies Actions

import { createVote, getAct, getAdjacentActs, getDefaultCategories, getUserCategories, getVoteForActByUser, type AdjacentActs, type DefaultCategories, type UserCategories, type Vote, type VotesForActByUser } from '$lib/server/db/querys';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const session = await event.locals.auth();
  if (!session?.user) {
    return redirect(403, "/")
  }
  let adjacentActs: AdjacentActs | undefined;
  const act = await getAct(event.params.id);
  let categories: UserCategories | DefaultCategories = await getUserCategories(session.user.id!);
  const votesByUser: VotesForActByUser = await getVoteForActByUser(session.user.id!, event.params.id)


  if (categories.length == 0) {
    categories = await getDefaultCategories()
  }

  if (act[0].act.position) {
    adjacentActs = await getAdjacentActs(act[0].act.position)
    console.log(adjacentActs)
  }

  return {
    act: act,
    categories: categories,
    votes: votesByUser,
    adjacentActs: adjacentActs
  }
};

export const actions = {
  vote: async (event: RequestEvent) => {
    const session = await event.locals.auth();
    if (!session?.user) {
      return { success: false, message: "Not Authorized" }
    }

    const formData = await event.request.formData()
    const userID = session.user.id

    let newVote: Vote = {
      userID: userID!,
      actID: event.params.id,
      categories: formData.get("categorie_id")?.toString()!,
      points: formData.get("points")?.toString()!
    }

    try {
      createVote(newVote)
    } catch (e) {
      return { success: false, message: "Failed to update categorie" }
    }
    return { success: true }
  }
} satisfies Actions

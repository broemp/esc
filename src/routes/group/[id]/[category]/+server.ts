import { getRankingCategoryGroup } from "$lib/server/db/queries";
import { fail, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function GET(request: RequestEvent) {
  const session = await request.locals.auth()
  if (!session?.user) {
    return fail(403)
  }

  let ranking = getRankingCategoryGroup(request.params.id, request.params.category)

  return json({
    ranking: await ranking
  })
}

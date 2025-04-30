import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { createVote, type Vote } from "$lib/server/db/queries";
import { fail } from "assert";

export async function POST(request: RequestEvent) {
  const session = await request.locals.auth()
  const { data } = await request.request.json()

  if (!session?.user) {
    return fail("403")
  }
  let newVote: Vote = {
    userID: session.user.id!,
    actID: request.params.id,
    categories: data["category"],
    points: data["points"] + ''
  }
  try {
    createVote(newVote)
  } catch (e) {
    return fail("500")
  }

  return json({ status: 200 })
}

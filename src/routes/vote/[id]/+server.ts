import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { createVote, type Vote } from "$lib/server/db/queries";

export async function POST(request: RequestEvent) {
	const session = await request.locals.auth();
	const { data } = await request.request.json();

	if (!session?.user) {
		throw error(403, 'Not authorized');
	}

	const newVote: Vote = {
		userID: session.user.id!,
		actID: request.params.id,
		categories: data["category"],
		points: data["points"] + ''
	};

	try {
		await createVote(newVote);
	} catch {
		throw error(500, 'Vote failed');
	}

	return json({ status: 200 });
}

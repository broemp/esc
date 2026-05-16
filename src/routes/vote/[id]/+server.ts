import { json, error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { createVote, type Vote } from "$lib/server/db/queries";

export async function POST(request: RequestEvent) {
	const session = await request.locals.auth();

	if (!session?.user) {
		throw error(403, 'Not authorized');
	}

	const { data } = await request.request.json();

	const points = Number(data["points"]);
	if (!Number.isFinite(points) || points < 0 || points > 10 || (points * 2) % 1 !== 0) {
		throw error(400, 'Invalid points value');
	}

	const newVote: Vote = {
		userID: session.user.id!,
		actID: request.params.id,
		categories: data["category"],
		points: points.toString()
	};

	try {
		await createVote(newVote);
	} catch {
		throw error(500, 'Vote failed');
	}

	return json({ status: 200 });
}

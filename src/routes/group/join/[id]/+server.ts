import { joinGroup } from '$lib/server/db/querys';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const user = await event.locals.auth();
	const userID = user?.user?.id;
	if (!userID || !event.params.id) {
		return new Response(JSON.stringify('error'), { status: 400 });
	}
	// TODO: Handle already in group
	joinGroup({ groupId: event.params.id, userId: userID });
	return new Response(JSON.stringify('success'), { status: 200 });
};

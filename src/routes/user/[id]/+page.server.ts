import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUser, getUserVotes, getGroupsFromUser } from '$lib/server/db/queries';

export const load: PageServerLoad = async ({ params }) => {
    const userId = params.id;

    // Fetch user data
    const userData = await getUser(userId);
    const user = userData[0];

    if (!user) {
        throw error(404, 'User not found');
    }

    // Fetch user's votes
    const userVotes = await getUserVotes(userId);

    // Fetch user's public groups
    const userGroups = await getGroupsFromUser(userId);
    const publicGroups = userGroups.filter(group => group.group?.public);

    return {
        user,
        votes: userVotes,
        publicGroups
    };
}; 
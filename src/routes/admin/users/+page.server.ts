import { getAllUsers, getTotalUsersCount } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (!session || session.user?.role !== 'admin') {
		redirect(303, '/');
	}

	const page = Number(event.url.searchParams.get('page')) || 1;
	const limit = 10;
	const offset = (page - 1) * limit;

	const [users, totalUsers] = await Promise.all([
		getAllUsers(limit, offset),
		getTotalUsersCount()
	]);

	return {
		users,
		totalUsers: totalUsers[0].count,
		currentPage: page,
		limit
	};
}; 
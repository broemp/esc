import { updateUserRole } from '$lib/server/db/queries';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth();
	if (!session || session.user?.role !== 'admin') {
		throw error(403, 'Unauthorized');
	}

	try {
		await updateUserRole(params.id, 'deleted');
		return json({ success: true });
	} catch (err) {
		throw error(500, 'Failed to delete user');
	}
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth();
	if (!session || session.user?.role !== 'admin') {
		throw error(403, 'Unauthorized');
	}

	try {
		const { role } = await request.json();
		const updatedUser = await updateUserRole(params.id, role);
		return json(updatedUser[0]);
	} catch (err) {
		throw error(500, 'Failed to update user role');
	}
}; 
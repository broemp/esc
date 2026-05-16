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

const VALID_ROLES = ['user', 'admin', 'deleted'] as const;

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth();
	if (!session || session.user?.role !== 'admin') {
		throw error(403, 'Unauthorized');
	}

	try {
		const { role } = await request.json();
		if (!VALID_ROLES.includes(role)) {
			throw error(400, 'Invalid role');
		}
		const updatedUser = await updateUserRole(params.id, role);
		return json(updatedUser[0]);
	} catch (err) {
		if ((err as any)?.status) throw err;
		throw error(500, 'Failed to update user role');
	}
}; 
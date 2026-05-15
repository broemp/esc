import { SvelteKitAuth } from '@auth/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import Discord from '@auth/core/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { env } from '$env/dynamic/private';
import { getDb, runMigrations } from '$lib/server/db/db';
import { seedDevData } from '$lib/server/db/seed';
import { eq } from 'drizzle-orm';
import { users, accounts, groups, userInGroups, authenticators } from '$lib/server/db/schema';
import Reddit from '@auth/core/providers/reddit';
import Google from '@auth/core/providers/google';
import Passkey from '@auth/core/providers/passkey';

runMigrations().then(seedDevData).catch(console.error);

const { handle: authenticationHandle } = SvelteKitAuth({
	adapter: DrizzleAdapter(getDb(), { usersTable: users, accountsTable: accounts, authenticatorsTable: authenticators }),
	providers: [
		Discord({ clientId: env.DISCORD_ID, clientSecret: env.DISCORD_SECRET }),
		Reddit({ clientId: env.REDDIT_ID, clientSecret: env.REDDIT_SECRET }),
		Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET }),
		Passkey
	],
	pages: {
		signIn: '/auth/signIn',
		signOut: '/auth/signOut',
		error: '/auth/error'
	},
	callbacks: {
		async session({ session, user }) {
			const result = await getDb()
				.select({ role: users.role })
				.from(users)
				.where(eq(users.id, user.id))
				.limit(1);
			session.user.role = result[0].role;
			return session;
		}
	},
	events: {
		async createUser({ user }) {
			const defaultGroups = await getDb()
				.select({ id: groups.id })
				.from(groups)
				.where(eq(groups.isDefault, true));
			for (const group of defaultGroups) {
				await getDb()
					.insert(userInGroups)
					.values({ groupId: group.id, userId: user.id! })
					.onConflictDoNothing()
					.execute();
			}
		}
	},
	experimental: { enableWebAuthn: true },
	trustHost: true
});

export const authorizationHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();

	if (session?.user?.role === 'admin') {
		event.cookies.set('is_admin', 'true', {
			path: '/',
			httpOnly: false,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7
		});
	} else {
		event.cookies.delete('is_admin', { path: '/' });
	}

	if (event.url.pathname.startsWith('/authenticate')) {
		if (!session) {
			redirect(303, '/auth/signin');
		}
	}

	if (
		event.url.pathname.startsWith('/group') ||
		event.url.pathname.startsWith('/profile') ||
		event.url.pathname.startsWith('/vote')
	) {
		if (!session) {
			redirect(303, '/auth/signin');
		}
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (session?.user?.role !== 'admin') {
			redirect(303, '/');
		}
	}

	return resolve(event);
};

export const handle = sequence(authenticationHandle, authorizationHandle);

import { SvelteKitAuth } from '@auth/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import Discord from '@auth/core/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import Reddit from '@auth/core/providers/reddit';
import Google from '@auth/core/providers/google';

const { handle: authenticationHandle } = SvelteKitAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({ clientId: env.DISCORD_ID, clientSecret: env.DISCORD_SECRET }),
    Reddit({ clientId: env.REDDIT_ID, clientSecret: env.REDDIT_SECRET }),
    Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET })
  ],
  pages: {
    signIn: '/auth/signIn',
    signOut: '/auth/signOut',
    error: '/auth/error'
  },
  callbacks: {
    async session({ session, user }) {
      const result = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      session.user.role = result[0].role;
      return session;
    }
  },
  trustHost: true
});

export const authorizationHandle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/authenticate')) {
    const session = await event.locals.auth();
    if (!session) {
      redirect(303, '/auth/signin');
    }
  }

  if (event.url.pathname.startsWith('/group') || event.url.pathname.startsWith('/profile') || event.url.pathname.startsWith('/vote')) {
    const session = await event.locals.auth();
    if (!session) {
      redirect(303, '/auth/signin');
    }
  }

  if (event.url.pathname.startsWith('/admin')) {
    const session = await event.locals.auth();
    if (session?.user?.role != 'admin') {
      redirect(303, '/');
    }
  }
  return resolve(event);
};

export const handle = sequence(authenticationHandle, authorizationHandle);

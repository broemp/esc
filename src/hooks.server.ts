
import { SvelteKitAuth } from "@auth/sveltekit"
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import Discord from "@auth/core/providers/discord"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { DISCORD_ID, DISCORD_SECRET, GOOGLE_ID, GOOGLE_SECRET, REDDIT_ID, REDDIT_SECRET } from "$env/static/private"
import { db } from "$lib/server/db/db";
import { eq } from 'drizzle-orm';
import { users } from "$lib/server/db/schema";
import Reddit from "@auth/core/providers/reddit";
import Google from "@auth/core/providers/google";

const { handle: authenticationHandle } = SvelteKitAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET }),
    Reddit({ clientId: REDDIT_ID, clientSecret: REDDIT_SECRET }),
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })
  ],
  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signOut",
    error: "/auth/error"
  },
  callbacks: {
    async session({ session, user }) {
      const result = await db.select({ role: users.role })
        .from(users).where(eq(users.id, user.id)).limit(1)
      session.user.role = result[0].role
      return session
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

  if (event.url.pathname.startsWith("/group")) {
    const session = await event.locals.auth();
    if (!session) {
      redirect(303, '/auth/signin')
    }
  }

  if (event.url.pathname.startsWith('/admin')) {
    const session = await event.locals.auth();
    if (session?.user?.role != "admin") {
      redirect(303, '/');
    }
  }
  return resolve(event);
}

export const handle = sequence(authenticationHandle, authorizationHandle);

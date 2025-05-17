import { SvelteKitAuth } from '@auth/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import Discord from '@auth/core/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { env } from '$env/dynamic/private';
import { getDb, runMigrations } from '$lib/server/db/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import Reddit from '@auth/core/providers/reddit';
import Google from '@auth/core/providers/google';
import { trace } from '@opentelemetry/api';
import { apiLatency, apiErrors, authAttempts, authFailures } from '$lib/server/metrics';

// Initialize OpenTelemetry
import './lib/server/telemetry';

// Run migrations when the server starts
if (process.env.NODE_ENV !== 'production') {
	runMigrations().catch(console.error);
}

const { handle: authenticationHandle } = SvelteKitAuth({
	adapter: DrizzleAdapter(getDb()),
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
			const result = await getDb()
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
  const tracer = trace.getTracer('esc-app');
  const startTime = performance.now();
  
  try {
    const session = await event.locals.auth();
    
    // Track authentication attempts
    authAttempts.add(1);
    
    // Set or clear admin cookie based on session
    if (session?.user?.role === 'admin') {
      event.cookies.set('is_admin', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    } else {
      event.cookies.delete('is_admin', { path: '/' });
    }

    if (event.url.pathname.startsWith('/authenticate')) {
      if (!session) {
        redirect(303, '/auth/signin');
      }
    }

    if (event.url.pathname.startsWith('/group') || event.url.pathname.startsWith('/profile') || event.url.pathname.startsWith('/vote')) {
      if (!session) {
        redirect(303, '/auth/signin');
      }
    }

    if (event.url.pathname.startsWith('/admin')) {
      if (session?.user?.role !== 'admin') {
        redirect(303, '/');
      }
    }

    const response = await resolve(event);
    
    // Record API latency
    const endTime = performance.now();
    apiLatency.record(endTime - startTime, {
      path: event.url.pathname,
      method: event.request.method
    });

    return response;
  } catch (error) {
    // Record errors
    apiErrors.add(1, {
      path: event.url.pathname,
      method: event.request.method,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    if (error instanceof Error && error.message.includes('auth')) {
      authFailures.add(1);
    }
    
    throw error;
  }
};

export const handle = sequence(authenticationHandle, authorizationHandle);

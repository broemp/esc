<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	const callbackUrl = $page.url.searchParams.get('callbackUrl') ?? '/';
</script>

<div class="flex items-center justify-center min-h-[88vh] px-4">
	<div class="w-full max-w-sm">
		<div class="card-esc p-8 relative overflow-hidden">
			<div class="absolute top-0 left-0 right-0 h-0.5" style="background: var(--gradient-brand-horizontal);"></div>

			<div class="text-center mb-8">
				<h1 class="text-gradient text-4xl font-bold tracking-tight leading-none mb-2">ESC 2026</h1>
				<p class="text-sm" style="color: oklch(0.50 0 0);">Sign in to join the watch party</p>
			</div>

			<div class="space-y-3">
				<button
					onclick={() => signIn('discord', { callbackUrl })}
					class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all"
					style="background: oklch(0.09 0 0); border: 1px solid oklch(0.22 0 0 / 0.7); color: oklch(0.92 0 0);"
					onmouseenter={(e) => (e.currentTarget.style.borderColor = 'oklch(0.35 0 0)')}
					onmouseleave={(e) => (e.currentTarget.style.borderColor = 'oklch(0.22 0 0 / 0.7)')}
				>
					<i class="fa-brands fa-discord text-[#5865F2] text-xl"></i>
					Continue with Discord
				</button>

				<button
					onclick={() => signIn('google', { callbackUrl })}
					class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all"
					style="background: oklch(0.09 0 0); border: 1px solid oklch(0.22 0 0 / 0.7); color: oklch(0.92 0 0);"
					onmouseenter={(e) => (e.currentTarget.style.borderColor = 'oklch(0.35 0 0)')}
					onmouseleave={(e) => (e.currentTarget.style.borderColor = 'oklch(0.22 0 0 / 0.7)')}
				>
					<i class="fa-brands fa-google text-xl" style="color: #EA4335;"></i>
					Continue with Google
				</button>
			</div>

			<p class="text-center text-xs mt-6" style="color: oklch(0.35 0 0);">
				Eurovision 2026 · Vienna · 70th Anniversary
			</p>
		</div>
	</div>
</div>

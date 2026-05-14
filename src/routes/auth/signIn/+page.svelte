<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	const callbackUrl = $page.url.searchParams.get('callbackUrl') ?? '/';
</script>

<div class="flex items-center justify-center min-h-[80vh] px-4">
	<div
		class="w-full max-w-sm p-8 rounded-2xl border"
		style="background: oklch(0.10 0 0); border-color: oklch(0.22 0.04 82 / 0.4);"
	>
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold tracking-wide" style="color: #D4AF37;">Eurovision 2026</h1>
			<p class="text-sm mt-1" style="color: oklch(0.55 0 0);">Sign in to join the watch party</p>
		</div>

		<div class="space-y-3">
			<button
				onclick={() => signIn('discord', { callbackUrl })}
				class="w-full btn preset-filled-surface-800 flex items-center justify-center gap-3 py-3 rounded-xl border transition-colors hover:border-[#D4AF37]/50"
				style="border-color: oklch(0.22 0 0);"
			>
				<i class="fa-brands fa-discord text-[#5865F2] text-xl"></i>
				<span class="font-semibold">Continue with Discord</span>
			</button>

			<button
				onclick={() => signIn('google', { callbackUrl })}
				class="w-full btn preset-filled-surface-800 flex items-center justify-center gap-3 py-3 rounded-xl border transition-colors hover:border-[#D4AF37]/50"
				style="border-color: oklch(0.22 0 0);"
			>
				<i class="fa-brands fa-google text-xl"></i>
				<span class="font-semibold">Continue with Google</span>
			</button>
		</div>

		<p class="text-center text-xs mt-6" style="color: oklch(0.40 0 0);">
			Eurovision 2026 · Vienna · 70th Anniversary
		</p>
	</div>
</div>

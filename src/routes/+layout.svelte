<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { browser } from '$app/environment';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { children } = $props();

	let isAdmin = $state(false);

	if (browser) {
		const value = `; ${document.cookie}`;
		const parts = value.split('; is_admin=');
		if (parts.length === 2) {
			isAdmin = parts.pop()?.split(';').shift() === 'true';
		}
	}

	function showHelp() {
		toastStore.trigger(
			`<div class="space-y-2">
				<p class="font-bold">How to Vote</p>
				<ul class="list-disc list-inside space-y-1 text-sm">
					<li>To vote you have to join a group</li>
					<li>Groups determine on what categories you vote</li>
					<li>You can create your own group with the categories of your choice</li>
					<li>You can join multiple groups</li>
					<li>You can invite others to groups</li>
				</ul>
			</div>`,
			'info',
			10000
		);
	}
</script>

<svelte:head>
	<title>{$page.data.title ?? 'ESC 2026'}</title>
</svelte:head>

<div
	data-theme="esc2026"
	class="flex flex-col min-h-screen"
	style="background: oklch(0.06 0 0); color: oklch(0.97 0 0);"
>
	<Toast />

	<header
		class="sticky top-0 z-40 flex items-center justify-between px-4 h-14"
		style="background: oklch(0.06 0 0 / 0.92); backdrop-filter: blur(12px); border-bottom: 1px solid oklch(0.14 0 0);"
	>
		<a href="/" class="text-gradient font-bold text-xl tracking-tight leading-none">
			ESC<span class="font-light" style="opacity: 0.5;">·</span>2026
		</a>

		<div class="flex items-center gap-1">
			{#if !$page.data.session}
				<a href="/auth/signIn" class="btn-brand px-4 py-1.5 rounded-lg text-sm">Sign In</a>
			{:else}
				{#if !isAdmin}
					<button class="btn-ghost p-2 rounded-lg" onclick={showHelp} aria-label="Help">
						<i class="fa-solid fa-circle-question text-lg"></i>
					</button>
				{/if}
				{#if isAdmin}
					<a href="/admin" class="btn-ghost px-3 py-1.5 rounded-lg text-sm font-medium">Admin</a>
				{/if}
				<button class="btn-ghost px-3 py-1.5 rounded-lg text-sm" onclick={() => signOut()}>
					Sign Out
				</button>
			{/if}
		</div>
	</header>

	<div class="gradient-line"></div>

	<main class="flex-1 mb-20">
		{@render children()}
	</main>

	<Footer />
</div>

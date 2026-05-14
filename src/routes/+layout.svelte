<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ResponsiveLogo from '$lib/components/ResponsiveLogo.svelte';
	import ResponsiveBackground from '$lib/components/ResponsiveBackground.svelte';
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

<div data-theme="cerberus" class="flex flex-col min-h-screen text-white">
	<Toast />
	<ResponsiveBackground />

	<AppBar class="bg-[oklch(0.09_0_0)]">
		<AppBar.Toolbar class="flex items-center justify-between px-4 py-2">
			<AppBar.Lead class="flex items-center">
				<a href="/" class="flex items-center gap-3">
					<ResponsiveLogo class="h-8 w-auto" />
				</a>
			</AppBar.Lead>
			<AppBar.Trail class="flex items-center gap-2">
				{#if !$page.data.session}
					<a class="btn btn-sm variant-ghost-surface" href="/auth/signIn">Sign In</a>
				{:else}
					{#if !isAdmin}
						<button class="btn btn-sm variant-ghost-surface" onclick={showHelp} aria-label="Help">
							<i class="fa-solid fa-circle-question"></i>
						</button>
					{/if}
					{#if isAdmin}
						<a href="/admin" class="btn btn-sm variant-ghost-surface">Admin</a>
					{/if}
					<button class="btn btn-sm variant-ghost-surface" onclick={() => signOut()}>Sign Out</button>
				{/if}
			</AppBar.Trail>
		</AppBar.Toolbar>
	</AppBar>

	<!-- Gold accent line -->
	<div
		class="h-px shrink-0"
		style="background: linear-gradient(90deg, transparent 0%, #D4AF37 25%, #D4AF37 75%, transparent 100%); opacity: 0.45;"
	></div>

	<main class="flex-1 mb-14">
		{@render children()}
	</main>

	<Footer />
</div>

<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import Footer from '$lib/components/layout/Footer.svelte';

	//Toast
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Check admin status from cookie
	import { browser } from '$app/environment';
	let isAdmin = false;

	// Function to get cookie value
	function getCookie(name: string): string | null {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
		return null;
	}

	// Check admin status when component mounts
	if (browser) {
		const adminCookie = getCookie('is_admin');
		isAdmin = adminCookie === 'true';
	}
</script>

<Toast />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/">
					<img src="/logo_esc25.png" alt="logo" width="150" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !$page.data.session}
					<a class="btn btn-sm variant-ghost-surface" href="/auth/signIn"> Sign In </a>
				{:else}
					{#if isAdmin}
						<a href="/admin" class="btn btn-sm variant-ghost-surface"> Admin </a>
					{/if}
					<button class="btn btn-sm variant-ghost-surface" on:click={() => signOut()}>
						Sign Out
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
		<div class="border-b border-white"></div>
	</svelte:fragment>
	<div class="mb-14">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter">
		<Footer></Footer>
	</svelte:fragment>
</AppShell>

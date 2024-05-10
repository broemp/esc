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
</script>

<Toast />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/">
					<img src="/logo.png" alt="logo" width="150" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !$page.data.session}
					<a class="btn btn-sm variant-ghost-surface" href="/auth/signIn"> Sign In </a>
				{:else}
					{#if $page.data?.session?.user?.role === 'admin'}
						<a href="/admin" class="btn btn-sm variant-ghost-surface"> Admin </a>
					{/if}
					<button class="btn btn-sm variant-ghost-surface" on:click={() => signOut()}>
						Sign Out
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<div>
		<Footer></Footer>
	</div>
</AppShell>

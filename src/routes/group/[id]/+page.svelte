<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { PUBLIC_APP_URL } from '$env/static/public';
	import { qr } from '@svelte-put/qr/svg';
	import ShareButton from '$lib/components/shareButton.svelte';

	export let data: PageServerData;
	const ShareURL = PUBLIC_APP_URL + '/group/join/' + data.slug;
	let tabSet: number = 0;
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="votes" value={0}>Votes</Tab>
	<Tab bind:group={tabSet} name="members" value={1}>Members</Tab>
	<Tab bind:group={tabSet} name="invite" value={2}>Invite</Tab>
	<Tab bind:group={tabSet} name="settings" value={3}>Settings</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			(tab panel 1 contents)
		{:else if tabSet === 1}
			<div class="flex justify-center">
				{#each data.members as member}
					<a href={'/user/' + member.userid} class="btn variant-glass-primary">
						{member.username}
					</a>
				{/each}
			</div>
		{:else if tabSet === 2}
			<div class="flex justify-center">
				<svg
					use:qr={{
						data: ShareURL,
						shape: 'circle'
					}}
				/>
			</div>
			<div class="flex justify-center">
				<ShareButton url={ShareURL} title="Join my ESC Group" design="btn variant-glass-primary"
					>Share</ShareButton
				>
			</div>
		{:else if tabSet === 3}
			(tab panel 4 contents)
		{/if}
	</svelte:fragment>
</TabGroup>

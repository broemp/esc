<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { env } from '$env/dynamic/public';
	import { qr } from '@svelte-put/qr/svg';
	import ShareButton from '$lib/components/shareButton.svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	const group = data.group;
	const members = data.members;
	const isAdmin = data.isAdmin;
	const groupCategories = data.categories;
	let ranking = data.songVotes;
	let selectedCategory: string;

	const ShareURL = env.PUBLIC_APP_URL + '/group/join/' + group.group.id;
	let tabSet: number = 0;

	function onCategoryChange() {
		axios.get('/group/' + group.group.id + '/' + selectedCategory).then(function (response) {
			ranking = response.data.ranking;
		});
	}

	function onActClick(actID: string) {
		goto('/vote/' + actID);
	}
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="ranking" value={0}>Ranking</Tab>
	<Tab bind:group={tabSet} name="members" value={1}>Members</Tab>
	<Tab bind:group={tabSet} name="invite" value={2}>Invite</Tab>
	<Tab bind:group={tabSet} name="settings" value={3}>Settings</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<div class="m-2">
				<select class="select" bind:value={selectedCategory} on:change={onCategoryChange}>
					{#each groupCategories as category}
						<option value={category.category?.id}
							>{category.category?.name.replace('_', ' ').toUpperCase()}</option
						>
					{/each}
				</select>
			</div>
			<div class="grid grid-cols-1 m-2 space-y-2">
				{#each ranking as act}
					<div class="card p-4 variant-filled-primary" on:click={() => onActClick(act.actID)}>
						<div class="flex justify-between">
							<p class="flex">
								<img src={act.countryImage} alt="country heart" class="w-6 h-6 mr-2" />
								<span class="font-bold">{act.artist}</span> -
								{act.title}
							</p>
							<p>
								{act.score}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{:else if tabSet === 1}
			<div class="grid grid-cols-1 justify-center space-y-4 px-4">
				{#each members as member}
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
			{#if isAdmin}
				Admin
				<!-- TODO: Group Settings-->
			{:else}
				<!-- TODO: LEAVE BUTTON-->
			{/if}
		{/if}
	</svelte:fragment>
</TabGroup>

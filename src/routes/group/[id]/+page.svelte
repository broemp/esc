<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { env } from '$env/dynamic/public';
	import { qr } from '@svelte-put/qr/svg';
	import ShareButton from '$lib/components/shareButton.svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageServerData;
	const group = data.group;
	const members = data.members;
	const isAdmin = data.isAdmin;
	const groupCategories = data.categories;
	let ranking = data.songVotes;
	let selectedCategory: string;
	let groupName = group.group.name || '';
	let isPublic = group.group.public;
	let allCategories: { id: string; name: string; default: boolean }[] = [];
	let activeCategories = new Set(groupCategories.map(c => c.category?.name || ''));
	let selectedCategories = new Set(activeCategories);

	const ShareURL = env.PUBLIC_APP_URL + '/group/join/' + group.group.id;
	let tabSet: number = 0;

	onMount(async () => {
		try {
			// Get all available categories
			const allResponse = await axios.get('/api/categories');
			allCategories = allResponse.data.map((c: any) => ({
				id: c.id,
				name: c.name,
				default: c.default
			}));
			// Initialize selected categories with active ones
			selectedCategories = new Set(activeCategories);
		} catch (error) {
			console.error('Failed to fetch categories:', error);
		}
	});

	function onCategoryChange() {
		axios.get('/group/' + group.group.id + '/' + selectedCategory).then(function (response) {
			ranking = response.data.ranking;
		});
	}

	function onActClick(actID: string) {
		goto('/vote/' + actID);
	}

	async function updateGroupSettings() {
		try {
			await axios.post('/group/' + group.group.id + '/settings', {
				name: groupName,
				public: isPublic
			});
		} catch (error) {
			console.error('Failed to update group settings:', error);
		}
	}

	async function updateCategories() {
		try {
			await axios.post('/group/' + group.group.id + '/settings/categories', {
				categories: Array.from(selectedCategories)
			});
		} catch (error) {
			console.error('Failed to update categories:', error);
		}
	}

	async function leaveGroup() {
		if (confirm('Are you sure you want to leave this group?')) {
			try {
				await axios.post('/group/' + group.group.id + '/leave');
				goto('/group');
			} catch (error) {
				console.error('Failed to leave group:', error);
			}
		}
	}

	function toggleCategory(category: string) {
		if (selectedCategories.has(category)) {
			selectedCategories.delete(category);
		} else {
			selectedCategories.add(category);
		}
		selectedCategories = selectedCategories; // Trigger reactivity
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
				<div class="p-4 space-y-4">
					<h2 class="text-xl font-bold">Group Settings</h2>
					<div class="space-y-4">
						<div class="space-y-2">
							<h3 class="font-semibold">Basic Settings</h3>
							<label class="label font-bold">
								<p>Group Name</p>
								<input class="input" type="text" bind:value={groupName} />
							</label>
							<label class="flex items-center space-x-2">
								<input type="checkbox" class="checkbox" bind:checked={isPublic} />
								<span>Public Group</span>
							</label>
							<button class="btn variant-filled-primary w-full" on:click={updateGroupSettings}>
								Save Basic Settings
							</button>
						</div>

						<hr class="!border-t-2" />

						<div class="space-y-2">
							<h3 class="font-semibold">Categories</h3>
							<div class="grid grid-cols-2 gap-2">
								{#each allCategories as category}
									<label class="flex items-center space-x-2 p-2 rounded hover:bg-surface-500">
										<input
											type="checkbox"
											class="checkbox"
											checked={selectedCategories.has(category.name)}
											on:change={() => toggleCategory(category.name)}
										/>
										<span>{category.name.replace('_', ' ').toUpperCase()}</span>
									</label>
								{/each}
							</div>
							<button class="btn variant-filled-primary w-full" on:click={updateCategories}>
								Save Categories
							</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="p-4">
					<button class="btn variant-filled-warning w-full" on:click={leaveGroup}>
						Leave Group
					</button>
				</div>
			{/if}
		{/if}
	</svelte:fragment>
</TabGroup>

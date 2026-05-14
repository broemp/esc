<script lang="ts">
	import type { PageServerData } from './$types';
	import { env } from '$env/dynamic/public';
	import { qr } from '@svelte-put/qr/svg';
	import ShareButton from '$lib/components/shareButton.svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();

	const group = data.group;
	const members = data.members;
	const isAdmin = data.isAdmin;
	const groupCategories = data.categories;

	let ranking = $state(data.songVotes);
	let selectedCategory = $state('overall');
	let groupName = $state(group.group.name || '');
	let isPublic = $state(group.group.public);
	let allCategories = $state<{ id: string; name: string; default: boolean }[]>([]);
	let activeCategories = $state(new Set(groupCategories.map((c) => c.category?.name || '')));
	let selectedCategories = $state(new Set(activeCategories));
	let activeTab = $state(0);

	const ShareURL = env.PUBLIC_APP_URL + '/group/join/' + group.group.id;

	$effect(() => {
		axios
			.get('/api/categories')
			.then((res) => {
				allCategories = res.data.map((c: { id: string; name: string; default: boolean }) => ({
					id: c.id,
					name: c.name,
					default: c.default
				}));
				selectedCategories = new Set(activeCategories);
				ranking = data.overallRanking;
			})
			.catch(() => {});
	});

	function onCategoryChange() {
		if (selectedCategory === 'overall') {
			ranking = data.overallRanking;
		} else {
			axios.get('/group/' + group.group.id + '/' + selectedCategory).then((res) => {
				ranking = res.data.ranking;
			});
		}
	}

	async function updateGroupSettings() {
		await axios.post('/group/' + group.group.id + '/settings', {
			name: groupName,
			public: isPublic
		});
	}

	async function updateCategories() {
		await axios.post('/group/' + group.group.id + '/settings/categories', {
			categories: Array.from(selectedCategories)
		});
	}

	async function leaveGroup() {
		if (confirm('Are you sure you want to leave this group?')) {
			await axios.post('/group/' + group.group.id + '/leave');
			goto('/group');
		}
	}

	function toggleCategory(name: string) {
		if (selectedCategories.has(name)) {
			selectedCategories.delete(name);
		} else {
			selectedCategories.add(name);
		}
		selectedCategories = new Set(selectedCategories);
	}

	const tabs = ['Ranking', 'Members', 'Invite', 'Settings'];
</script>

<div>
	<div class="flex justify-center gap-2 p-2" style="border-bottom: 1px solid oklch(0.22 0.04 82 / 0.3);">
		{#each tabs as tab, i}
			<button
				class="btn btn-sm {activeTab === i ? 'variant-filled-primary' : 'variant-ghost-surface'}"
				onclick={() => (activeTab = i)}
			>
				{tab}
			</button>
		{/each}
	</div>

	{#if activeTab === 0}
		<div class="m-2">
			<select class="select" bind:value={selectedCategory} onchange={onCategoryChange}>
				<option value="overall">OVERALL</option>
				{#each groupCategories as category}
					{#if category.category?.id && category.category?.name}
						<option value={category.category.id}
							>{category.category.name.replace('_', ' ').toUpperCase()}</option
						>
					{/if}
				{/each}
			</select>
		</div>
		<div class="grid grid-cols-1 m-2 space-y-2">
			{#each ranking as act}
				<div
					class="card p-4 variant-filled-primary cursor-pointer"
					onclick={() => goto('/vote/' + act.actID)}
					role="button"
					tabindex="0"
					onkeypress={(e) => e.key === 'Enter' && goto('/vote/' + act.actID)}
				>
					<div class="flex justify-between">
						<p class="flex">
							<img src={act.countryImage} alt="country" class="w-6 h-6 mr-2" />
							<span class="font-bold">{act.artist}</span> - {act.title}
						</p>
						<p>{act.score}</p>
					</div>
				</div>
			{/each}
		</div>
	{:else if activeTab === 1}
		<div class="grid grid-cols-1 justify-center space-y-4 px-4 pt-4">
			{#each members as member}
				<a href={'/user/' + member.userid} class="btn variant-glass-primary">
					{member.username}
				</a>
			{/each}
		</div>
	{:else if activeTab === 2}
		<div class="flex justify-center pt-4">
			<div class="w-48 pb-2">
				<svg use:qr={{ data: ShareURL, shape: 'circle' }} />
			</div>
		</div>
		<div class="flex justify-center">
			<ShareButton url={ShareURL} title="Join my ESC Group" design="btn variant-glass-primary">
				{#snippet children()}Share{/snippet}
			</ShareButton>
		</div>
	{:else if activeTab === 3}
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
						<button class="btn variant-filled-primary w-full" onclick={updateGroupSettings}>
							Save Basic Settings
						</button>
					</div>
					<hr class="border-t-2" />
					<div class="space-y-2">
						<h3 class="font-semibold">Categories</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each allCategories as category}
								<label class="flex items-center space-x-2 p-2 rounded hover:preset-tonal-surface">
									<input
										type="checkbox"
										class="checkbox"
										checked={selectedCategories.has(category.name)}
										onchange={() => toggleCategory(category.name)}
									/>
									<span>{category.name.replace('_', ' ').toUpperCase()}</span>
								</label>
							{/each}
						</div>
						<button class="btn variant-filled-primary w-full" onclick={updateCategories}>
							Save Categories
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="p-4">
				<button class="btn variant-filled-warning w-full" onclick={leaveGroup}>Leave Group</button>
			</div>
		{/if}
	{/if}
</div>

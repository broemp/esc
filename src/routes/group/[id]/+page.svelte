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

<div class="max-w-lg mx-auto">
	<!-- Tab bar -->
	<div
		class="flex overflow-x-auto"
		style="border-bottom: 1px solid oklch(0.14 0 0);"
	>
		{#each tabs as tab, i}
			<button
				class="tab-esc {activeTab === i ? 'active' : ''}"
				onclick={() => (activeTab = i)}
			>
				{tab}
			</button>
		{/each}
	</div>

	<!-- Ranking tab -->
	{#if activeTab === 0}
		<div class="p-4 space-y-3">
			<select class="select-esc" bind:value={selectedCategory} onchange={onCategoryChange}>
				<option value="overall">Overall</option>
				{#each groupCategories as category}
					{#if category.category?.id && category.category?.name}
						<option value={category.category.id}>
							{category.category.name.replace('_', ' ')}
						</option>
					{/if}
				{/each}
			</select>

			<div class="space-y-1.5">
				{#each ranking as act}
					<button
						type="button"
						class="card-esc p-3 w-full flex items-center gap-3 cursor-pointer hover:border-[oklch(0.30_0_0)] transition-colors text-left"
						onclick={() => goto('/vote/' + act.actID)}
						onkeypress={(e) => e.key === 'Enter' && goto('/vote/' + act.actID)}
					>
						<img src={act.countryImage} alt="country" class="w-6 h-6 object-contain shrink-0" />
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm truncate">{act.artist}</p>
							<p class="text-xs truncate" style="color: oklch(0.50 0 0);">{act.title}</p>
						</div>
						<span class="text-gradient font-bold text-base shrink-0">{act.score}</span>
					</button>
				{/each}
			</div>
		</div>

	<!-- Members tab -->
	{:else if activeTab === 1}
		<div class="p-4 space-y-2">
			{#each members as member}
				<a
					href={'/user/' + member.userid}
					class="card-esc px-4 py-3 flex items-center gap-3 hover:border-[oklch(0.30_0_0)] transition-colors block"
				>
					<i class="fa-solid fa-user text-sm" style="color: oklch(0.45 0 0);"></i>
					<span class="font-medium text-sm flex-1">{member.username}</span>
					<i class="fa-solid fa-chevron-right text-xs" style="color: oklch(0.35 0 0);"></i>
				</a>
			{/each}
		</div>

	<!-- Invite tab -->
	{:else if activeTab === 2}
		<div class="p-8 flex flex-col items-center space-y-6">
			<div class="gradient-border p-1 rounded-xl inline-block" style="background: oklch(0.09 0 0);">
				<div class="p-3" style="background: white; border-radius: 0.5rem;">
					<svg use:qr={{ data: ShareURL, shape: 'circle' }} class="w-40 h-40" />
				</div>
			</div>

			<ShareButton url={ShareURL} title="Join my ESC Group" design="btn-brand px-8 py-3 rounded-xl text-sm font-semibold">
				{#snippet children()}
					<i class="fa-solid fa-share-nodes mr-2"></i>Share Link
				{/snippet}
			</ShareButton>

			<p class="text-xs text-center break-all" style="color: oklch(0.40 0 0);">{ShareURL}</p>
		</div>

	<!-- Settings tab -->
	{:else if activeTab === 3}
		{#if isAdmin}
			<div class="p-4 space-y-6">
				<!-- Basic Settings -->
				<div class="space-y-4">
					<p class="text-xs uppercase tracking-widest" style="color: oklch(0.42 0 0);">Basic Settings</p>
					<div>
						<label for="groupName" class="block text-xs mb-2" style="color: oklch(0.55 0 0);">Group Name</label>
						<input
							id="groupName"
							class="input-esc"
							type="text"
							bind:value={groupName}
						/>
					</div>
					<div class="card-esc p-3 flex items-center justify-between">
						<span class="text-sm font-medium">Public Group</span>
						<input type="checkbox" class="checkbox-esc" bind:checked={isPublic} />
					</div>
					<button class="btn-brand w-full h-11 rounded-xl text-sm font-semibold" onclick={updateGroupSettings}>
						Save Settings
					</button>
				</div>

				<div class="gradient-line"></div>

				<!-- Categories -->
				<div class="space-y-3">
					<p class="text-xs uppercase tracking-widest" style="color: oklch(0.42 0 0);">Categories</p>
					<div class="grid grid-cols-2 gap-2">
						{#each allCategories as category}
							<label class="card-esc p-3 flex items-center gap-3 cursor-pointer hover:border-[oklch(0.28_0_0)] transition-colors">
								<input
									type="checkbox"
									class="checkbox-esc"
									checked={selectedCategories.has(category.name)}
									onchange={() => toggleCategory(category.name)}
								/>
								<span class="text-sm">{category.name.replace('_', ' ')}</span>
							</label>
						{/each}
					</div>
					<button class="btn-brand w-full h-11 rounded-xl text-sm font-semibold" onclick={updateCategories}>
						Save Categories
					</button>
				</div>
			</div>
		{:else}
			<div class="p-4">
				<button
					class="w-full h-12 rounded-xl text-sm font-semibold text-white"
					style="background: oklch(0.40 0.22 20);"
					onclick={leaveGroup}
				>
					Leave Group
				</button>
			</div>
		{/if}
	{/if}
</div>

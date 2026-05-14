<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const categories = [...new Set(data.votes.map((v) => v.category?.name || 'song').filter(Boolean))];
	if (!categories.includes('song')) categories.unshift('song');

	let selectedCategory = $state('song');

	const filteredVotes = $derived(data.votes.filter((v) => v.category?.name === selectedCategory));
	const isOwnProfile = $derived($page.data.session?.user?.id === data.user.id);

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="rounded-2xl p-6 text-white" style="background: oklch(0.10 0 0); border: 1px solid oklch(0.22 0.04 82 / 0.35);">
		<div class="flex items-center justify-between mb-8">
			<div class="flex items-center space-x-4">
				{#if data.user.image}
					<img
						src={data.user.image}
						alt={data.user.name || 'User avatar'}
						class="w-24 h-24 rounded-full object-cover border-4"
						style="border-color: #D4AF37;"
					/>
				{:else}
					<div
						class="w-24 h-24 rounded-full flex items-center justify-center border-4"
						style="background: oklch(0.15 0 0); border-color: #D4AF37;"
					>
						<span class="text-4xl" style="color: #D4AF37;">
							{data.user.name?.[0]?.toUpperCase() || '?'}
						</span>
					</div>
				{/if}
				<div>
					<h1 class="text-3xl font-bold">{data.user.name || 'Anonymous User'}</h1>
					<p style="color: oklch(0.55 0 0);">
						Member since {new Date(data.user.createdAt).toLocaleDateString()}
					</p>
				</div>
			</div>
			{#if isOwnProfile}
				<button class="btn preset-tonal p-2" onclick={() => goto('/settings')} title="Settings">
					<i class="fa-solid fa-gear text-2xl"></i>
				</button>
			{/if}
		</div>

		<div class="mt-8">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
				<h2 class="text-2xl font-semibold">Votes</h2>
				<div class="sm:hidden">
					<select
						class="w-full p-2 rounded-lg text-white"
						style="background: oklch(0.14 0 0); border: 1px solid oklch(0.22 0.04 82 / 0.4);"
						bind:value={selectedCategory}
					>
						{#each categories as category}
							<option value={category}>{capitalize(category)}</option>
						{/each}
					</select>
				</div>
				<div class="hidden sm:flex space-x-2">
					{#each categories as category}
						<button
							class="px-4 py-2 rounded-full transition-colors font-semibold"
							style={selectedCategory === category
								? 'background: #D4AF37; color: oklch(0.15 0.05 82);'
								: 'background: oklch(0.15 0 0); color: oklch(0.65 0 0);'}
							onclick={() => (selectedCategory = category)}
						>
							{capitalize(category)}
						</button>
					{/each}
				</div>
			</div>

			{#if filteredVotes.length === 0}
				<p style="color: oklch(0.55 0 0);">No votes in this category yet</p>
			{:else}
				<div class="space-y-4">
					{#each filteredVotes as vote}
						<div
							class="flex items-center space-x-4 p-4 rounded-xl"
							style="background: oklch(0.13 0 0); border: 1px solid oklch(0.20 0.04 82 / 0.25);"
						>
							{#if vote.act?.picture_url}
								<img
									src={vote.act.picture_url}
									alt={vote.act.title}
									class="w-16 h-16 object-cover rounded border-2"
									style="border-color: oklch(0.22 0.04 82 / 0.5);"
								/>
							{:else if vote.country?.imageURL}
								<img
									src={vote.country.imageURL}
									alt={vote.act?.title}
									class="w-16 h-16 object-cover rounded border-2"
									style="border-color: oklch(0.22 0.04 82 / 0.5);"
								/>
							{:else}
								<div
									class="w-16 h-16 rounded flex items-center justify-center border-2"
									style="background: oklch(0.15 0 0); border-color: oklch(0.22 0.04 82 / 0.5);"
								>
									<span style="color: oklch(0.55 0 0);">—</span>
								</div>
							{/if}
							<div class="flex-1">
								<h3 class="font-semibold">{vote.act?.artist} - {vote.act?.title}</h3>
							</div>
							<div class="text-xl font-bold" style="color: #D4AF37;">{vote.points} pts</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="mt-8">
			<h2 class="text-2xl font-semibold mb-4">Public Groups</h2>
			{#if data.publicGroups.length === 0}
				<p style="color: oklch(0.55 0 0);">No public groups yet</p>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{#each data.publicGroups as group}
						<a href="/group/{group.group?.id}">
							<div
								class="p-4 rounded-xl transition-colors hover:brightness-110"
								style="background: oklch(0.13 0 0); border: 1px solid oklch(0.20 0.04 82 / 0.3);"
							>
								<h3 class="font-semibold">{group.group?.name}</h3>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

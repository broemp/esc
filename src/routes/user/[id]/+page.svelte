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

	// Mini stats computed from loaded votes
	const miniStats = $derived.by(() => {
		if (data.votes.length === 0) return null;
		const avg = data.votes.reduce((s, v) => s + parseFloat(v.points as string), 0) / data.votes.length;
		const byCat: Record<string, { sum: number; count: number }> = {};
		for (const v of data.votes) {
			const cat = v.category?.name ?? 'song';
			if (!byCat[cat]) byCat[cat] = { sum: 0, count: 0 };
			byCat[cat].sum += parseFloat(v.points as string);
			byCat[cat].count++;
		}
		const catAvgs = Object.entries(byCat).map(([name, { sum, count }]) => ({
			name,
			avg: sum / count,
		}));
		catAvgs.sort((a, b) => b.avg - a.avg);
		return {
			total: data.votes.length,
			avg: avg.toFixed(1),
			topCat: catAvgs[0] ?? null,
			bottomCat: catAvgs[catAvgs.length - 1] ?? null,
		};
	});
</script>

<div class="max-w-2xl mx-auto px-4 pt-6 pb-6">
	<!-- Profile header -->
	<div class="flex items-center gap-4 mb-5">
		{#if data.user.image}
			<div class="relative shrink-0">
				<div class="w-18 h-18 rounded-full p-[2px]" style="background: var(--gradient-brand);">
					<img
						src={data.user.image}
						alt={data.user.name || 'User avatar'}
						class="w-16 h-16 rounded-full object-cover block"
					/>
				</div>
			</div>
		{:else}
			<div class="relative shrink-0">
				<div class="w-18 h-18 rounded-full p-[2px]" style="background: var(--gradient-brand);">
					<div
						class="w-16 h-16 rounded-full flex items-center justify-center"
						style="background: oklch(0.09 0 0);"
					>
						<span class="text-gradient text-2xl font-bold">
							{data.user.name?.[0]?.toUpperCase() || '?'}
						</span>
					</div>
				</div>
			</div>
		{/if}

		<div class="flex-1 min-w-0">
			<h1 class="font-bold text-xl truncate">{data.user.name || 'Anonymous User'}</h1>
			<p class="text-xs mt-0.5" style="color: oklch(0.50 0 0);">
				Member since {new Date(data.user.createdAt).toLocaleDateString()}
			</p>
		</div>

		{#if isOwnProfile}
			<button class="btn-ghost p-2 rounded-lg" onclick={() => goto('/settings')} title="Settings">
				<i class="fa-solid fa-gear text-lg"></i>
			</button>
		{/if}
	</div>

	<div class="gradient-line mb-5"></div>

	<!-- Votes section -->
	<div class="mb-6">
		<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Votes</p>

		<!-- Category filter: select on mobile, pills on desktop -->
		<div class="sm:hidden mb-4">
			<select class="select-esc" bind:value={selectedCategory}>
				{#each categories as category}
					<option value={category}>{capitalize(category)}</option>
				{/each}
			</select>
		</div>
		<div class="hidden sm:flex flex-wrap gap-2 mb-4">
			{#each categories as category}
				<button
					class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
					onclick={() => (selectedCategory = category)}
					style={selectedCategory === category
						? 'background: var(--gradient-brand); color: white;'
						: 'background: oklch(0.09 0 0); border: 1px solid oklch(0.20 0 0 / 0.7); color: oklch(0.55 0 0);'}
				>
					{capitalize(category)}
				</button>
			{/each}
		</div>

		{#if filteredVotes.length === 0}
			<p class="text-sm" style="color: oklch(0.48 0 0);">No votes in this category yet</p>
		{:else}
			<div class="space-y-1.5">
				{#each filteredVotes as vote}
					<div class="card-esc p-3 flex items-center gap-3">
						{#if vote.act?.picture_url}
							<img
								src={vote.act.picture_url}
								alt={vote.act.title}
								class="w-12 h-12 object-contain rounded-lg shrink-0"
								style="background: oklch(0.07 0 0);"
							/>
						{:else if vote.country?.imageURL}
							<img
								src={vote.country.imageURL}
								alt={vote.act?.title}
								class="w-12 h-12 object-contain rounded-lg shrink-0"
							/>
						{:else}
							<div class="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center" style="background: oklch(0.12 0 0);">
								<i class="fa-solid fa-music text-sm" style="color: oklch(0.35 0 0);"></i>
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm truncate">{vote.act?.artist}</p>
							<p class="text-xs truncate" style="color: oklch(0.50 0 0);">{vote.act?.title}</p>
						</div>
						<span class="text-gradient font-bold text-base shrink-0">{vote.points}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Mini stats card -->
	{#if miniStats}
		<div class="gradient-line mb-5"></div>
		<div class="mb-6">
			<div class="flex items-center justify-between mb-3">
				<p class="text-xs uppercase tracking-widest" style="color: oklch(0.42 0 0);">Stats snapshot</p>
				<a href="/stats" class="text-xs btn-ghost px-2 py-1 rounded" style="color: oklch(0.50 0 0);">
					Full stats <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
				</a>
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<div class="card-esc p-3 text-center">
					<p class="text-gradient font-bold text-lg">{miniStats.total}</p>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Votes cast</p>
				</div>
				<div class="card-esc p-3 text-center">
					<p class="text-gradient font-bold text-lg">{miniStats.avg}</p>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Avg score</p>
				</div>
				{#if miniStats.topCat}
					<div class="card-esc p-3 text-center">
						<p class="font-semibold text-sm truncate" style="color: oklch(0.72 0.18 142);">{capitalize(miniStats.topCat.name)}</p>
						<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Highest rated</p>
					</div>
				{/if}
				{#if miniStats.bottomCat && miniStats.bottomCat.name !== miniStats.topCat?.name}
					<div class="card-esc p-3 text-center">
						<p class="font-semibold text-sm truncate" style="color: oklch(0.65 0.18 25);">{capitalize(miniStats.bottomCat.name)}</p>
						<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">Toughest on</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Public Groups section -->
	{#if data.publicGroups.length > 0}
		<div class="gradient-line mb-5"></div>
		<div>
			<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Public Groups</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
				{#each data.publicGroups as group}
					<a href="/group/{group.group?.id}" class="card-esc p-4 block hover:border-[oklch(0.30_0_0)] transition-colors">
						<h3 class="font-semibold text-sm">{group.group?.name}</h3>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>

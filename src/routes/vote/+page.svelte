<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import ActImage from '$lib/components/ActImage.svelte';

	let { data }: { data: PageServerData } = $props();

	const acts = data.acts;
	const nextAct = data.nextAct[0];
	const votedActIds = new Set(data.votedActIds);
	const firstUnvotedAct = acts.find(a => !votedActIds.has(a.act.id));

	onMount(() => {
		const el = document.querySelector('[data-first-unvoted]');
		el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
</script>

<div class="max-w-lg mx-auto pb-6">
	{#if nextAct}
		<button
			type="button"
			class="w-full card-esc-featured p-4 flex items-center gap-4 mb-1 cursor-pointer"
			onclick={() => goto(`/vote/${nextAct.id}`)}
			onkeypress={(e) => e.key === 'Enter' && goto(`/vote/${nextAct.id}`)}
		>
			<ActImage
				src={nextAct.picture_url}
				alt={nextAct.artist}
				class="w-16 h-16 rounded-lg object-contain shrink-0"
				style="background: oklch(0.07 0 0);"
			/>
			<div class="flex-1 text-left min-w-0">
				<span class="text-[10px] uppercase tracking-widest font-semibold" style="color: oklch(0.50 0 0);">Up Next</span>
				<p class="font-bold text-sm truncate">{nextAct.artist}</p>
				<p class="text-xs truncate" style="color: oklch(0.55 0 0);">{nextAct.title}</p>
			</div>
			<i class="fa-solid fa-arrow-right shrink-0" style="color: oklch(0.45 0 0);"></i>
		</button>
	{/if}

	<div class="act-list">
		{#each acts as act}
			{@const voted = votedActIds.has(act.act.id)}
			<a
				href="/vote/{act.act.id}"
				class="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[oklch(0.10_0_0)] block"
				style="border-bottom: 1px solid oklch(0.13 0 0);"
				data-first-unvoted={act.act.id === firstUnvotedAct?.act.id ? '' : undefined}
			>
				<span class="text-gradient font-bold text-2xl w-10 text-center shrink-0">
					{act.act.position}
				</span>
				<ActImage
					src={act.act.picture_url}
					alt={act.act.artist}
					class="w-14 h-14 object-contain rounded-lg shrink-0"
					style="background: oklch(0.08 0 0);"
				/>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-1.5 mb-0.5">
						<img
							src={act.country.imageURL}
							alt={act.country.name}
							class="w-4 h-4 object-contain shrink-0"
						/>
						<span class="text-xs" style="color: oklch(0.50 0 0);">{act.country.name}</span>
					</div>
					<p class="font-semibold text-sm truncate">{act.act.artist}</p>
					<p class="text-xs truncate" style="color: oklch(0.50 0 0);">{act.act.title}</p>
				</div>
				{#if voted}
					<i class="fa-solid fa-check text-xs shrink-0" style="color: oklch(0.65 0.17 145);"></i>
				{:else}
					<i class="fa-solid fa-chevron-right text-xs shrink-0" style="color: oklch(0.35 0 0);"></i>
				{/if}
			</a>
		{/each}
	</div>
</div>

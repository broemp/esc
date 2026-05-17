<script lang="ts">
	import type { PageServerData } from './$types';
	import type { UserCategories, DefaultCategories } from '$lib/server/db/queries';
	import { toastStore } from '$lib/stores/toast.svelte';
	import axios from 'axios';
	import ActImage from '$lib/components/ActImage.svelte';

	let { data }: { data: PageServerData } = $props();

	interface Vote {
		points: number;
		categoryId: string;
		name: string;
	}

	const act = data.act[0].act;
	const country = data.act[0].country!;
	const categories: UserCategories | DefaultCategories = data.categories;
	const votes = data.votes;
	const adjacentActs = data.adjacentActs;
	const votingLocked = data.votingLocked;
	const max = 10;

	let prevAct: string | undefined;
	let nextAct: string | undefined;

	adjacentActs?.forEach((a) => {
		if (a.position! < act.position!) prevAct = a.id;
		else if (a.position! > act.position!) nextAct = a.id;
	});

	const votesMap = new Map(votes.map((i): [string, number] => [i.categories, +i.points]));

	let categoryMap = $state(
		categories.map((i): [string, Vote] => {
			const id = 'category' in i ? i.category.id : i.id;
			const name = 'category' in i ? i.category.name : i.name;
			return [id, { categoryId: id, name, points: votesMap.get(id) ?? 5 }];
		})
	);

	async function updateVote(vote: Vote) {
		if (votingLocked) return;
		try {
			await axios.post('/vote/' + act.id, { data: { category: vote.categoryId, points: vote.points } });
			toastStore.trigger('Saved!', 'success', 500);
		} catch {
			toastStore.trigger('Error saving vote', 'error', 500);
		}
	}

	function navigate(actID: string | undefined) {
		if (!actID) {
			toastStore.trigger('Nothing here!', 'error', 500);
			return;
		}
		window.location.href = '/vote/' + actID;
	}
</script>

<div class="max-w-lg mx-auto pb-6">
	<!-- Voting locked banner -->
	{#if votingLocked}
		<div class="mx-4 mt-4 mb-2 px-4 py-3 rounded-xl flex items-center gap-3"
			style="background: oklch(0.18 0.05 20); border: 1px solid oklch(0.30 0.10 20);">
			<i class="fa-solid fa-lock text-sm shrink-0" style="color: oklch(0.70 0.18 25);"></i>
			<div>
				<p class="text-sm font-semibold" style="color: oklch(0.82 0.10 25);">Voting has ended</p>
				<p class="text-xs" style="color: oklch(0.55 0.05 20);">Scores are locked. <a href="/stats" class="underline">View final results →</a></p>
			</div>
		</div>
	{/if}

	<!-- Hero image -->
	<div class="w-full" style="background: oklch(0.04 0 0); height: 14rem;">
		<ActImage
			src={act.picture_url}
			alt={act.artist}
			class="w-full h-full object-contain"
		/>
	</div>

	<!-- Navigation row -->
	<div class="grid items-center py-3 px-4" style="grid-template-columns: 48px 1fr 48px;">
		<button
			class="btn-ghost h-12 w-12 rounded-lg flex items-center justify-center"
			onclick={() => navigate(prevAct)}
			aria-label="Previous act"
		>
			<i class="fa-solid fa-chevron-left"></i>
		</button>

		<div class="flex flex-col items-center gap-1">
			<img src={country.imageURL} alt={country.name} class="w-8 h-8 object-contain" />
			<p class="font-bold text-sm text-center leading-tight">{act.artist}</p>
			<p class="text-xs text-center" style="color: oklch(0.55 0 0);">{act.title}</p>
		</div>

		<button
			class="btn-ghost h-12 w-12 rounded-lg flex items-center justify-center"
			onclick={() => navigate(nextAct)}
			aria-label="Next act"
		>
			<i class="fa-solid fa-chevron-right"></i>
		</button>
	</div>

	<div class="gradient-line mx-4"></div>

	<!-- Voting sliders -->
	<form method="post" action="?/vote">
		{#each categoryMap as [id, category]}
			<div class="px-4 py-5">
				<div class="flex justify-between items-baseline mb-3">
					<span class="text-sm font-semibold uppercase tracking-widest" style="color: oklch(0.50 0 0);">
						{category.name.replace('_', ' ').trim()}
					</span>
					<span class="text-gradient font-bold text-lg">{category.points}</span>
				</div>

				<input
					type="range"
					name={id}
					class="slider-esc"
					bind:value={category.points}
					onchange={() => updateVote(category)}
					min={0}
					{max}
					step={0.5}
					disabled={votingLocked}
					style="background: linear-gradient(to right, #ff2d78, #7a00cc {(category.points / max * 100)}%, oklch(0.18 0 0) {(category.points / max * 100)}%); {votingLocked ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
				/>

				<div class="flex justify-between text-[10px] mt-1.5" style="color: oklch(0.32 0 0);">
					<span>0</span>
					<span>{max}</span>
				</div>
			</div>
			<div class="gradient-line mx-4" style="opacity: 0.15;"></div>
		{/each}
	</form>
</div>

<script lang="ts">
	import type { PageServerData } from './$types';
	import type { UserCategories, DefaultCategories } from '$lib/server/db/queries';
	import { toastStore } from '$lib/stores/toast.svelte';
	import axios from 'axios';

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

<div class="w-full md:w-2/3 mx-auto">
	<img src={act.picture_url} alt="act" class="w-full h-48 md:h-96 object-contain bg-black" />
	<div class="w-full">
		<div class="flex justify-center pb-2">
			<div class="grid grid-cols-12 w-full max-w-4xl">
				<button
					class="col-span-3 flex items-center justify-center text-2xl h-full hover:bg-gray-100/10 transition-colors"
					onclick={() => navigate(prevAct)}
				>
					<i class="fa-regular fa-circle-left"></i>
				</button>
				<div class="col-span-6 pt-2">
					<div class="flex justify-center">
						<img src={country.imageURL} alt="country" class="w-12 h-12 pr-2" />
						<p>
							<span class="font-bold">{act.artist}</span><br />{act.title}
						</p>
					</div>
				</div>
				<button
					class="col-span-3 flex items-center justify-center text-2xl h-full hover:bg-gray-100/10 transition-colors"
					onclick={() => navigate(nextAct)}
				>
					<i class="fa-regular fa-circle-right"></i>
				</button>
			</div>
		</div>
	</div>
	<hr class="pb-2" style="border-top: 1px solid oklch(0.22 0.04 82 / 0.3);" />
	<form method="post" action="?/vote">
		{#each categoryMap as [id, category]}
			<div class="flex justify-center">
				<div class="mx-4 max-w-xl w-full py-2">
					<div class="flex flex-col gap-1 mb-2">
						<div class="text-center font-bold">
							{category.name.replace('_', ' ').toLocaleUpperCase().trim()}
						</div>
						<div class="flex justify-between text-xs text-gray-400">
							<span>0</span>
							<span>{category.points} / {max}</span>
						</div>
					</div>
					<input
						type="range"
						name={id}
						class="w-full"
						bind:value={category.points}
						onchange={() => updateVote(category)}
						min={0}
						{max}
						step={0.5}
					/>
				</div>
			</div>
		{/each}
	</form>
</div>

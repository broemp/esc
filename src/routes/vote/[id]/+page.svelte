<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { UserCategories } from '$lib/server/db/querys';
	import axios from 'axios';

	export let data: PageServerData;
	const toastStore = getToastStore();

	interface Vote {
		points: number;
		categoryId: string;
		name: string;
	}

	let act = data.act[0].act;
	let country = data.act[0].country!;
	let categories: UserCategories = data.categories;
	let votes = data.votes;
	let adjacentActs = data.adjacentActs;
	const max = 10;

	let prevAct: any | undefined;
	let nextAct: any | undefined;

	adjacentActs?.forEach((a) => {
		if (a.position! < act.position!) {
			prevAct = a;
			return;
		}
		if (a.position! > act.position!) {
			nextAct = a;
		}
	});

	let votesMap = new Map(votes.map((i): [string, number] => [i.categories, +i.points]));

	var categoryMap = categories.map((i): [string, Vote] => [
		i.category.id,
		{
			categoryId: i.category.id,
			name: i.category.name,
			points: votesMap.has(i.category.id) ? votesMap.get(i.category.id)! : 5
		}
	]);

	async function updateVote(vote: Vote) {
		await axios
			.post('/vote/' + act.id, {
				data: {
					category: vote.categoryId,
					points: vote.points
				}
			})
			.then(() => {
				const t: ToastSettings = {
					message: 'Success! 🎉',
					background: 'variant-filled-success',
					hideDismiss: true,
					timeout: 500
				};
				toastStore.trigger(t);
			})
			.catch(() => {
				const t: ToastSettings = {
					message: 'Error! 🎉',
					background: 'variant-filled-error',
					hideDismiss: true,
					timeout: 500
				};
				toastStore.trigger(t);
			});
	}
</script>

<div>
	<img src={act.picture_url} alt="act" class="w-full h-48" />
	<div class="grid grid-cols-3 w-full">
		{#if prevAct}
			<div>
				<a href="/vote/{prevAct.id}">
					<i class="fa-regular fa-circle-left"></i>
				</a>
			</div>
		{/if}
		<p>
			{act.position} - {country.name} <br />
			{act.artist} <br />
			{act.title}
		</p>
		{#if nextAct}<div>
				<a href="/vote/{nextAct.id}">
					<i class="fa-regular fa-circle-right"></i>
				</a>
			</div>
		{/if}
	</div>
	<form method="post" action="?/vote">
		{#each [...categoryMap] as [id, category]}
			<div>
				<RangeSlider
					name={id}
					bind:value={category.points}
					on:change={() => updateVote(category)}
					{max}
					step={0.5}
					ticked
				>
					<div class="flex justify-between items-center">
						<div class="font-bold">{category.name}</div>
						<div class="text-xs">{category.points} / {max}</div>
					</div>
				</RangeSlider>
			</div>
		{/each}
	</form>
</div>

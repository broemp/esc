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
		id: string;
		name: string;
	}

	let act = data.act[0].act;
	let country = data.act[0].country!;
	let categories: UserCategories = data.categories;
	let votes = data.votes;
	const max = 10;

	if (categories.length === 0) {
		// TODO: Get default categories
	}
	let categorieVote: Vote[] = [];
	categories.forEach((category) => {
		categorieVote.push({
			id: category.category.id,
			name: category.category.name,
			points: 5
		});
	});

	categorieVote.forEach((categorieVote) => {
		votes.forEach((vote) => {
			if (categorieVote.id == vote.categories) {
				categorieVote.points = vote.points;
			}
		});
	});

	async function updateVote(vote: Vote) {
		await axios
			.post('/vote/' + act.id, {
				data: {
					category: vote.id,
					points: vote.points
				}
			})
			.then(() => {
				const t: ToastSettings = {
					message: 'Success! 🎉',
					// Provide any utility or variant background style:
					background: 'variant-filled-success'
				};
				toastStore.trigger(t);
			})
			.catch(() => {
				const t: ToastSettings = {
					message: 'Error! 🎉',
					// Provide any utility or variant background style:
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			});
	}
</script>

<div>
	<img src={act.picture_url} alt="act" />
	<div>
		<p>
			{act.position} - {country.name} <br />
			{act.artist} <br />
			{act.title}
		</p>
	</div>
	<form method="post" action="?/vote">
		{#each categorieVote as category}
			<div>
				<RangeSlider
					name={category.id}
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
		<div class="flex justify-center">
			<button class="btn variant-soft-success">Vote!</button>
		</div>
	</form>
</div>

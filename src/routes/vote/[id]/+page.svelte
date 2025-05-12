<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { UserCategories, DefaultCategories } from '$lib/server/db/queries';
	import axios from 'axios';
	import { PUBLIC_APP_URL } from '$env/static/public';

	export let data: PageServerData;
	const toastStore = getToastStore();

	interface Vote {
		points: number;
		categoryId: string;
		name: string;
	}

	let act = data.act[0].act;
	let country = data.act[0].country!;
	let categories: UserCategories | DefaultCategories = data.categories;
	let votes = data.votes;
	let adjacentActs = data.adjacentActs;
	const max = 10;

	let prevAct: any | undefined;
	let nextAct: any | undefined;

	adjacentActs?.forEach((a) => {
		if (a.position! < act.position!) {
			prevAct = a.id;
			return;
		}
		if (a.position! > act.position!) {
			nextAct = a.id;
		}
	});

	let votesMap = new Map(votes.map((i): [string, number] => [i.categories, +i.points]));

	var categoryMap = categories.map((i): [string, Vote] => [
		'category' in i ? i.category.id : i.id,
		{
			categoryId: 'category' in i ? i.category.id : i.id,
			name: 'category' in i ? i.category.name : i.name,
			points: votesMap.has('category' in i ? i.category.id : i.id) ? votesMap.get('category' in i ? i.category.id : i.id)! : 5
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
					message: 'Error!',
					background: 'variant-filled-error',
					hideDismiss: true,
					timeout: 500
				};
				toastStore.trigger(t);
			});
	}

	function navigate(actID: string) {
		if (actID == undefined) {
			const t: ToastSettings = {
				message: 'Nothing Here!',
				background: 'variant-filled-error',
				hideDismiss: true,
				timeout: 500
			};
			toastStore.trigger(t);
			return;
		}
		window.location.replace(PUBLIC_APP_URL + '/vote/' + actID);
	}
</script>

<div>
	<img src={act.picture_url} alt="act" class="w-full h-48 md:h-96 object-cover" />
	<div class="w-full">
		<div class="flex justify-center pb-2">
			<div class="grid grid-cols-12 w-full max-w-4xl">
				<button class="col-span-3 flex items-center justify-center text-2xl h-full hover:bg-gray-100 transition-colors" on:click={() => navigate(prevAct)}>
					<i class="fa-regular fa-circle-left"></i>
				</button>
				<div class="col-span-6 pt-2">
					<div class="flex justify-center">
						<img src={country.imageURL} alt="country heart" class="w-12 h-12" />
						<p>
							<span class="font-bold">
								{act.artist}
							</span> <br />
							{act.title}
						</p>
					</div>
				</div>
				<button class="col-span-3 flex items-center justify-center text-2xl h-full hover:bg-gray-100 transition-colors" on:click={() => navigate(nextAct)}>
					<i class="fa-regular fa-circle-right"></i>
				</button>
			</div>
		</div>
	</div>
	<hr class="!border-t-2 pb-2" />
	<form method="post" action="?/vote">
		{#each [...categoryMap] as [id, category]}
			<div class="flex justify-center">
				<RangeSlider
					name={id}
					class="mx-4 max-w-xl w-full"
					bind:value={category.points}
					on:change={() => updateVote(category)}
					{max}
					step={0.5}
					ticked
				>
					<div class="flex flex-col gap-1">
						<div class="text-center font-bold">
							{category.name.replace('_', ' ').toLocaleUpperCase().trim()}
						</div>
						<div class="flex justify-between text-xs text-gray-500">
							<span>0</span>
							<span>{category.points} / {max}</span>
						</div>
					</div>
				</RangeSlider>
			</div>
		{/each}
	</form>
</div>

<script lang="ts">
	import axios from 'axios';
	import CountryAutocomplete from './CountryAutocomplete.svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { CountryList } from '$lib/server/db/querys';

	const toastStore = getToastStore();
	export let countries: CountryList;
	export let drinkID: string;
	let drink: any;
	let country: any;
	let years = [2024];
	$: drink, getDrink(drinkID);

	function getDrink(id: string) {
		console.log('HIER');
		axios
			.get('/admin/drinks/' + id)
			.then(function (response) {
				console.log(response);
				drink = response.data[0];
			})
			.catch(function (error) {
				const t: ToastSettings = {
					message: 'OOPS! Something went wrong 😕',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			});
	}
</script>

<div class="w-full h-full">
	<div class="card text-xl p-4">
		{#if drink}
			<form method="POST" action="?/update">
				<div class="grid grid-cols-5 space-x-2 space-y-2">
					<label class="label col-span-full">
						Act ID
						<input class="input" type="text " name="id" bind:value={drink.id} readonly /></label
					>
					<label class="label col-span-4">
						<span>Name</span>
						<input class="input" type="text" name="name" bind:value={drink.name} />
					</label>
					<label class="label col-span-1">
						<span>Year</span>
						<select class="select" bind:value={drink.year} name="year">
							<option value={null}>NULL</option>
							{#each years as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="grid grid-cols-5 space-x-2">
					<label class="label col-span-4">
						<span>Alcohol Percentage</span>
						<input class="input" type="number" name="Percentage" bind:value={drink.percentage} />
					</label>
				</div>
				<CountryAutocomplete {countries} countryID={country.id} countryName={country.name}
				></CountryAutocomplete>
				<div class="flex justify-between m-4">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" name="alcohol" bind:value={drink.alcohol} />
						<p>Alcoholic</p>
					</label>
					<button formaction="?/delete" class="btn variant-filled-error">Delete</button>
					<button class="btn variant-filled-primary" type="submit">Save</button>
				</div>
			</form>
		{/if}
	</div>
</div>

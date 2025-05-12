<script lang="ts">
	import axios from 'axios';
	import CountryAutocomplete from './CountryAutocomplete.svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { CountryList } from '$lib/server/db/queries';

	const toastStore = getToastStore();
	export let countries: CountryList;
	export let drinkID: string;
	let drink: any;
	let country: any;
	const currentYear = new Date().getFullYear();
	let oldestYear = currentYear;
	let years: number[] = [];

	async function loadYears() {
		try {
			const response = await axios.get('/admin/drinks/oldest-year');
			oldestYear = response.data.year || currentYear;
			years = Array.from({ length: currentYear - oldestYear + 1 }, (_, i) => currentYear - i);
		} catch (error) {
			// If we can't get the oldest year, just use the last 5 years
			years = Array.from({ length: 5 }, (_, i) => currentYear - i);
		}
	}

	function getDrink(id: string) {
		axios
			.get('/admin/drinks/' + id)
			.then(function (response) {
				drink = response.data[0];
				country = {
					id: drink.countryID,
					name: drink.country?.name || ''
				};
			})
			.catch(function (error) {
				const t: ToastSettings = {
					message: 'OOPS! Something went wrong 😕',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			});
	}

	$: drink, getDrink(drinkID);
	loadYears();
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

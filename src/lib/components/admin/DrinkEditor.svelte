<script lang="ts">
	import axios from 'axios';
	import CountryAutocomplete from './CountryAutocomplete.svelte';
	import type { CountryList } from '$lib/server/db/queries';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { countries, drinkID }: { countries: CountryList[]; drinkID: string } = $props();

	const currentYear = new Date().getFullYear();
	let drink = $state<Record<string, unknown> | null>(null);
	let country = $state<{ id: string; name: string } | null>(null);
	let years = $state<number[]>([]);

	async function loadYears() {
		try {
			const res = await axios.get('/admin/drinks/oldest-year');
			const oldest = res.data.year || currentYear;
			years = Array.from({ length: currentYear - oldest + 1 }, (_, i) => currentYear - i);
		} catch {
			years = Array.from({ length: 5 }, (_, i) => currentYear - i);
		}
	}

	function getDrink(id: string) {
		axios
			.get('/admin/drinks/' + id)
			.then((res) => {
				drink = res.data[0];
				country = { id: drink!.countryID as string, name: (drink!.country as { name: string })?.name || '' };
			})
			.catch(() => toastStore.trigger('OOPS! Something went wrong', 'error'));
	}

	$effect(() => {
		if (drinkID) getDrink(drinkID);
	});

	loadYears();
</script>

<div class="w-full h-full">
	<div class="card text-xl p-4">
		{#if drink && country}
			<form method="POST" action="?/update">
				<div class="grid grid-cols-5 space-x-2 space-y-2">
					<label class="label col-span-full">
						ID
						<input class="input" type="text" name="id" bind:value={drink.id} readonly />
					</label>
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
				<CountryAutocomplete {countries} bind:countryID={country.id} bind:countryName={country.name} />
				<div class="flex justify-between m-4">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" name="alcohol" bind:value={drink.alcohol} />
						<p>Alcoholic</p>
					</label>
					<button formaction="?/delete" class="btn preset-filled-error-500">Delete</button>
					<button class="btn preset-filled-primary-500" type="submit">Save</button>
				</div>
			</form>
		{/if}
	</div>
</div>

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

<div class="w-full">
	<div class="card-esc p-4">
		{#if drink && country}
			<form method="POST" action="?/update" class="space-y-3">
				<div>
					<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">ID</label>
					<input class="input-box" type="text" name="id" bind:value={drink.id} readonly style="opacity: 0.5;" />
				</div>
				<div class="grid grid-cols-5 gap-2">
					<div class="col-span-4">
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Name</label>
						<input class="input-box" type="text" name="name" bind:value={drink.name} />
					</div>
					<div class="col-span-1">
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Year</label>
						<select class="select-esc" bind:value={drink.year} name="year">
							<option value={null}>–</option>
							{#each years as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
					</div>
				</div>
				<div>
					<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Alcohol %</label>
					<input class="input-box" type="number" name="Percentage" bind:value={drink.percentage} />
				</div>
				<CountryAutocomplete {countries} bind:countryID={country.id} bind:countryName={country.name} />
				<div class="flex justify-between items-center pt-2">
					<label class="flex items-center gap-2 cursor-pointer">
						<input class="checkbox-esc" type="checkbox" name="alcohol" bind:value={drink.alcohol} />
						<span class="text-sm">Alcoholic</span>
					</label>
					<div class="flex gap-2">
						<button formaction="?/delete" class="px-3 py-1.5 rounded text-xs font-semibold text-white" style="background: oklch(0.38 0.22 20);">Delete</button>
						<button class="btn-brand px-4 py-1.5 rounded text-xs font-semibold" type="submit">Save</button>
					</div>
				</div>
			</form>
		{:else}
			<p class="text-sm" style="color: oklch(0.45 0 0);">Select a drink to edit</p>
		{/if}
	</div>
</div>

<script lang="ts">
	import DrinkEditor from '$lib/components/admin/DrinkEditor.svelte';
	import DrinkList from '$lib/components/admin/DrinkList.svelte';
	import type { Drink, Country } from '$lib/types';
	import type { PageServerData } from './$types';

	let { data }: { data: { drinks: (Drink & { country: Country })[] | null; countries: Country[] } } =
		$props();

	let drinkID = $state('');
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
	<div class="md:col-span-2">
		{#if drinkID}
			<DrinkEditor {drinkID} countries={data.countries} />
		{:else}
			<div class="card-esc p-4 text-sm" style="color: oklch(0.50 0 0);">
				Select a drink to edit
			</div>
		{/if}
	</div>
	<div class="md:col-span-1">
		<a href="/admin/drinks/new">
			<button class="btn-brand w-full mb-2 py-2 rounded-lg text-sm font-semibold">Add Drink</button>
		</a>
		<DrinkList drinks={data.drinks} bind:selectedDrink={drinkID} />
	</div>
</div>

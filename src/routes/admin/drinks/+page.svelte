<script lang="ts">
	import DrinkEditor from '$lib/components/admin/DrinkEditor.svelte';
	import DrinkList from '$lib/components/admin/DrinkList.svelte';
	import type { Drink, Country } from '$lib/types';
	import type { PageServerData } from './$types';

	export let data: { drinks: (Drink & { country: Country })[] | null; countries: Country[] };
	let drinks = data?.drinks;
	let drinkID = '';
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
	<div class="md:col-span-2">
		{#if drinkID}
			<DrinkEditor {drinkID} countries={data.countries}></DrinkEditor>
		{:else}
			<div class="card text-xl p-4">
				<p>Select a drink to edit</p>
			</div>
		{/if}
	</div>
	<div class="md:col-span-1">
		<a href="/admin/drinks/new">
			<button class="btn variant-filled-primary w-full">Add Drink</button>
		</a>
		<DrinkList {drinks} bind:selectedDrink={drinkID}></DrinkList>
	</div>
</div>

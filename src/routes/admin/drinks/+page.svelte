<script lang="ts">
	import DrinkEditor from '$lib/components/admin/DrinkEditor.svelte';
	import DrinkList from '$lib/components/admin/DrinkList.svelte';
	import type { DrinkList as DrinkListType, CountryList } from '$lib/server/db/querys';
	import type { PageServerData } from './$types';

	export let data: { drinks: DrinkListType | null; countries: CountryList };
	let drinks = data?.drinks;
	let drinkID = '';
</script>

<div class="grid grid-cols-3 gap-4">
	<div class="col-span-2">
		<DrinkEditor {drinkID} countries={data.countries}></DrinkEditor>
	</div>
	<div class="col-span-1">
		<a href="/admin/drinks/new">
			<button class="btn variant-filled-primary w-full">Add Drink</button>
		</a>
		<DrinkList {drinks} bind:selectedDrink={drinkID}></DrinkList>
	</div>
</div>

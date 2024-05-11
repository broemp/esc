<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { DrinkList } from '$lib/server/db/querys';

	export let drinks: DrinkList;
	type DrinkListElement = DrinkList[0];
	export let selectedDrink: string;

	function tableMapper(data: DrinkList | null) {
		if (data == null) {
			return [[], []];
		}
		return data!.map((item: DrinkListElement) => {
			return [item.drink.name];
		});
	}

	function tableMapperMeta(data: DrinkList | null) {
		if (data == null) {
			return [[], []];
		}
		return data!.map((item: DrinkListElement) => {
			return [item.drink.id];
		});
	}

	function handleSelection(meta: any) {
		console.log(meta.detail[0]);
		selectedDrink = meta.detail[0];
	}

	let tableData: TableSource = {
		head: ['Drink'],
		body: tableMapper(drinks),
		meta: tableMapperMeta(drinks)
	};
</script>

<div class="w-full h-full">
	{#if !drinks}
		<div class="text-xl content-center">EMPTY</div>
	{:else}
		<Table source={tableData} interactive={true} on:selected={handleSelection} />
	{/if}
</div>

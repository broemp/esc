<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { Drink, Country } from '$lib/types';

	export let drinks: (Drink & { country: Country })[] | null;
	export let selectedDrink: string;

	function tableMapper(data: (Drink & { country: Country })[] | null) {
		if (data == null) {
			return [[], []];
		}
		return data.map((item) => {
			return [item.name];
		});
	}

	function tableMapperMeta(data: (Drink & { country: Country })[] | null) {
		if (data == null) {
			return [[], []];
		}
		return data.map((item) => {
			return [item.id];
		});
	}

	function handleSelection(meta: any) {
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

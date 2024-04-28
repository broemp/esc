<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import ActList from '$lib/components/admin/ActList.svelte';

	export let acts: any | null;
	export let selectedAct: string;

	function tableMapper(data: ActList) {
		return data.map((item: any) => {
			return [item.act.position || 'TBD', item.country.name, item.act.artist, item.act.title];
		});
	}

	function tableMapperMeta(data: ActList) {
		return data.map((item: any) => {
			let act = item.act;
			return [act.id];
		});
	}

	function handleSelection(meta: any) {
		selectedAct = meta.detail[0];
	}

	let tableData: TableSource = {
		head: ['Position', 'Country', 'Artist', 'Song'],
		body: tableMapper(acts),
		meta: tableMapperMeta(acts)
	};
</script>

<div class="w-full h-full p-2">
	{#if !acts}
		<div class="text-xl content-center">EMPTY</div>
	{:else}
		<Table source={tableData} interactive={true} on:selected={handleSelection} />
	{/if}
</div>

<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { ActList } from '$lib/server/db/querys';

	export let acts: ActList | null;
	type ActListElement = ActList[0];
	export let selectedAct: string;

	function tableMapper(data: ActList | null) {
		if (data == null) {
			return [[], []];
		}
		return data!.map((item: ActListElement) => {
			return [
				String(item.act.position) || 'TBD',
				item.country.name,
				item.act.artist,
				item.act.title
			];
		});
	}

	function tableMapperMeta(data: ActList | null) {
		if (data == null) {
			return [[], []];
		}
		return data!.map((item: ActListElement) => {
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

<div class="w-full h-full">
	{#if !acts}
		<div class="text-xl content-center">EMPTY</div>
	{:else}
		<Table source={tableData} interactive={true} on:selected={handleSelection} />
	{/if}
</div>

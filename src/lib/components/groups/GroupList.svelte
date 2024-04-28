<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';

	export let groups: any | null;
	export let selectedAct: string;

	function tableMapper(data: GroupList) {
		return data.map((item: any) => {
			return [item.act.position || 'TBD', item.country.name, item.act.artist, item.act.title];
		});
	}

	function tableMapperMeta(data: GroupList) {
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
		body: tableMapper(groups),
		meta: tableMapperMeta(groups)
	};
</script>

<div class="w-full h-full p-2">
	{#if !groups}
		<div class="text-xl content-center">EMPTY</div>
	{:else}
		<Table source={tableData} interactive={true} on:selected={handleSelection} />
	{/if}
</div>

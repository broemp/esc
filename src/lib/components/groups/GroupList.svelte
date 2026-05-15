<script lang="ts">
	let {
		groups,
		selectedAct = $bindable('')
	}: {
		groups: { act: { id: string; position: number | null; artist: string; title: string }; country: { name: string } }[] | null;
		selectedAct: string;
	} = $props();
</script>

<div class="w-full overflow-y-auto max-h-96">
	{#if !groups || groups.length === 0}
		<div class="text-center py-4 text-sm" style="color: oklch(0.45 0 0);">No acts</div>
	{:else}
		<table class="table-esc">
			<thead>
				<tr style="position: sticky; top: 0; background: oklch(0.09 0 0);">
					<th>#</th>
					<th>Country</th>
					<th>Artist</th>
					<th>Song</th>
				</tr>
			</thead>
			<tbody>
				{#each groups as item}
					<tr
						class="cursor-pointer {selectedAct === item.act.id ? 'selected' : ''}"
						onclick={() => (selectedAct = item.act.id)}
					>
						<td>{item.act.position ?? '–'}</td>
						<td>{item.country.name}</td>
						<td>{item.act.artist}</td>
						<td>{item.act.title}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

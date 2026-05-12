<script lang="ts">
	let {
		groups,
		selectedAct = $bindable('')
	}: {
		groups: { act: { id: string; position: number | null; artist: string; title: string }; country: { name: string } }[] | null;
		selectedAct: string;
	} = $props();
</script>

<div class="w-full h-full p-2 overflow-y-auto max-h-96">
	{#if !groups || groups.length === 0}
		<div class="text-xl text-center py-4">EMPTY</div>
	{:else}
		<table class="w-full text-sm">
			<thead class="sticky top-0 preset-tonal-surface">
				<tr>
					<th class="px-2 py-1 text-left">#</th>
					<th class="px-2 py-1 text-left">Country</th>
					<th class="px-2 py-1 text-left">Artist</th>
					<th class="px-2 py-1 text-left">Song</th>
				</tr>
			</thead>
			<tbody>
				{#each groups as item}
					<tr
						class="cursor-pointer hover:preset-tonal-primary {selectedAct === item.act.id ? 'preset-filled-primary-500' : ''}"
						onclick={() => (selectedAct = item.act.id)}
					>
						<td class="px-2 py-1">{item.act.position ?? 'TBD'}</td>
						<td class="px-2 py-1">{item.country.name}</td>
						<td class="px-2 py-1">{item.act.artist}</td>
						<td class="px-2 py-1">{item.act.title}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

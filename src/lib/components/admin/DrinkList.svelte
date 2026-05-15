<script lang="ts">
	import type { Drink, Country } from '$lib/types';

	let {
		drinks,
		selectedDrink = $bindable('')
	}: {
		drinks: (Drink & { country: Country })[] | null;
		selectedDrink: string;
	} = $props();
</script>

<div class="w-full overflow-y-auto max-h-96">
	{#if !drinks || drinks.length === 0}
		<div class="text-center py-4 text-sm" style="color: oklch(0.45 0 0);">No drinks</div>
	{:else}
		<table class="table-esc">
			<thead>
				<tr style="position: sticky; top: 0; background: oklch(0.09 0 0);">
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				{#each drinks as item}
					<tr
						class="cursor-pointer {selectedDrink === item.id ? 'selected' : ''}"
						onclick={() => (selectedDrink = item.id)}
					>
						<td>{item.name}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

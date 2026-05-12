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

<div class="w-full h-full overflow-y-auto max-h-96">
	{#if !drinks || drinks.length === 0}
		<div class="text-xl text-center py-4">EMPTY</div>
	{:else}
		<table class="w-full text-sm">
			<thead class="sticky top-0 preset-tonal-surface">
				<tr>
					<th class="px-2 py-1 text-left">Name</th>
				</tr>
			</thead>
			<tbody>
				{#each drinks as item}
					<tr
						class="cursor-pointer hover:preset-tonal-primary {selectedDrink === item.id ? 'preset-filled-primary-500' : ''}"
						onclick={() => (selectedDrink = item.id)}
					>
						<td class="px-2 py-1">{item.name}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

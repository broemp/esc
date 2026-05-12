<script lang="ts">
	import type { CountryList } from '$lib/server/db/queries';

	let {
		countries,
		countryName = $bindable(''),
		countryID = $bindable('')
	}: {
		countries: CountryList[];
		countryName?: string;
		countryID?: string;
	} = $props();

	let showSuggestions = $state(false);

	const filtered = $derived(
		countryName.length > 0
			? countries.filter((c) => c.name.toLowerCase().includes(countryName.toLowerCase()))
			: countries
	);

	function select(name: string, id: string) {
		countryName = name;
		countryID = id;
		showSuggestions = false;
	}
</script>

<label>
	Country
	<input
		class="input"
		type="text"
		name="country"
		bind:value={countryName}
		placeholder="Search..."
		onfocus={() => (showSuggestions = true)}
		onblur={() => setTimeout(() => (showSuggestions = false), 150)}
	/>
	<input class="hidden" type="hidden" name="country_id" bind:value={countryID} />
	{#if showSuggestions && filtered.length > 0}
		<div class="card w-full mt-1 max-h-48 overflow-y-auto preset-tonal-surface">
			{#each filtered as c}
				<button
					type="button"
					class="w-full text-left px-3 py-1.5 hover:preset-filled-primary-500 text-sm"
					onmousedown={() => select(c.name, c.id)}
				>
					{c.name}
				</button>
			{/each}
		</div>
	{/if}
</label>

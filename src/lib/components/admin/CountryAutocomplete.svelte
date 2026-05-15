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

<div>
	<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Country</label>
	<div class="relative">
		<input
			class="input-box"
			type="text"
			name="country"
			bind:value={countryName}
			placeholder="Search..."
			onfocus={() => (showSuggestions = true)}
			onblur={() => setTimeout(() => (showSuggestions = false), 150)}
		/>
		<input class="hidden" type="hidden" name="country_id" bind:value={countryID} />
		{#if showSuggestions && filtered.length > 0}
			<div class="card-esc absolute w-full mt-1 max-h-48 overflow-y-auto z-10">
				{#each filtered as c}
					<button
						type="button"
						class="w-full text-left px-3 py-2 text-sm transition-colors"
						style="color: oklch(0.85 0 0);"
						onmouseenter={(e) => (e.currentTarget.style.background = 'oklch(0.14 0 0)')}
						onmouseleave={(e) => (e.currentTarget.style.background = 'transparent')}
						onmousedown={() => select(c.name, c.id)}
					>
						{c.name}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

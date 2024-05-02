<script lang="ts">
	import type { CountryList } from '$lib/server/db/querys';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';

	export let countries: CountryList;
	export let countryName = '';
	export let countryID = '';

	let countryOptions: AutocompleteOption<string>[] = [];
	countries.forEach((country) => {
		let option: AutocompleteOption<string> = {
			label: country.name,
			value: country.id
		};
		countryOptions.push(option);
	});

	function onFlavorSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		countryName = event.detail.label;
		countryID = event.detail.value;
	}
</script>

<label>
	Country
	<input
		class="input"
		type="input"
		name="country"
		bind:value={countryName}
		placeholder="Search..."
	/>
	<input class="hidden" type="hidden" name="country_id" bind:value={countryID} />
	<div class="card w-full mt-2 max-h-48 overflow-y-auto variant-filled-secondary" tabindex="-1">
		<Autocomplete
			bind:input={countryName}
			options={countryOptions}
			on:selection={onFlavorSelection}
		/>
	</div>
</label>

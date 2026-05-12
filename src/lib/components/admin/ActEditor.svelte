<script lang="ts">
	import axios from 'axios';
	import CountryAutocomplete from './CountryAutocomplete.svelte';
	import type { CountryList } from '$lib/server/db/queries';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { countries, actID }: { countries: CountryList[]; actID: string } = $props();

	const years = [2024, 2025];
	let act = $state<Record<string, unknown> | null>(null);
	let country = $state<{ id: string; name: string } | null>(null);

	$effect(() => {
		if (actID) getAct(actID);
	});

	function getAct(id: string) {
		axios
			.get('/admin/acts/' + id)
			.then((res) => {
				act = res.data[0].act;
				country = res.data[0].country;
			})
			.catch(() => toastStore.trigger('OOPS! Something went wrong', 'error'));
	}
</script>

<div class="w-full h-full">
	<div class="card text-xl p-4">
		{#if act && country}
			<form method="POST" action="?/update">
				<div class="grid grid-cols-5 space-x-2 space-y-2">
					<label class="label col-span-full">
						Act ID
						<input class="input" type="text" name="act_id" bind:value={act.id} readonly />
					</label>
					<label class="label col-span-4">
						<span>Artist</span>
						<input class="input" name="artist" type="text" bind:value={act.artist} />
					</label>
					<label class="label col-span-1">
						<span>Year</span>
						<select class="select" bind:value={act.year} name="year">
							<option value={null}>NULL</option>
							{#each years as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="grid grid-cols-5 space-x-2">
					<label class="label col-span-4">
						<span>Title</span>
						<input class="input" type="text" name="title" bind:value={act.title} />
					</label>
					<label class="label col-span-1">
						<span>Position</span>
						<input class="input" type="number" name="position" bind:value={act.position} />
					</label>
				</div>
				<CountryAutocomplete {countries} bind:countryID={country.id} bind:countryName={country.name} />
				<label class="label">
					<span>Endpoints</span>
					<input class="input" type="number" name="endpoints" bind:value={act.endpoints} />
				</label>
				<div class="flex justify-between m-4">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" name="eliminated" bind:value={act.eliminated} />
						<p>Eliminated</p>
					</label>
					<button formaction="?/delete" class="btn variant-filled-error">Delete</button>
					<button class="btn variant-filled-primary" type="submit">Save</button>
				</div>
			</form>
		{/if}
	</div>
</div>

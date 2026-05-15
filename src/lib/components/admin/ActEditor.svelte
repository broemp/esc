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

<div class="w-full">
	<div class="card-esc p-4">
		{#if act && country}
			<form method="POST" action="?/update" class="space-y-3">
				<div>
					<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Act ID</label>
					<input class="input-box" type="text" name="act_id" bind:value={act.id} readonly style="opacity: 0.5;" />
				</div>
				<div class="grid grid-cols-5 gap-2">
					<div class="col-span-4">
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Artist</label>
						<input class="input-box" name="artist" type="text" bind:value={act.artist} />
					</div>
					<div class="col-span-1">
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Year</label>
						<select class="select-esc" bind:value={act.year} name="year">
							<option value={null}>–</option>
							{#each years as year}
								<option value={year}>{year}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="grid grid-cols-5 gap-2">
					<div class="col-span-4">
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Title</label>
						<input class="input-box" type="text" name="title" bind:value={act.title} />
					</div>
					<div class="col-span-1">
						<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Position</label>
						<input class="input-box" type="number" name="position" bind:value={act.position} />
					</div>
				</div>
				<CountryAutocomplete {countries} bind:countryID={country.id} bind:countryName={country.name} />
				<div>
					<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Endpoints</label>
					<input class="input-box" type="number" name="endpoints" bind:value={act.endpoints} />
				</div>
				<div class="flex justify-between items-center pt-2">
					<label class="flex items-center gap-2 cursor-pointer">
						<input class="checkbox-esc" type="checkbox" name="eliminated" bind:value={act.eliminated} />
						<span class="text-sm">Eliminated</span>
					</label>
					<div class="flex gap-2">
						<button formaction="?/delete" class="px-3 py-1.5 rounded text-xs font-semibold text-white" style="background: oklch(0.38 0.22 20);">Delete</button>
						<button class="btn-brand px-4 py-1.5 rounded text-xs font-semibold" type="submit">Save</button>
					</div>
				</div>
			</form>
		{:else}
			<p class="text-sm" style="color: oklch(0.45 0 0);">Select an act to edit</p>
		{/if}
	</div>
</div>

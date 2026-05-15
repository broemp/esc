<script lang="ts">
	import CountryAutocomplete from '$lib/components/admin/CountryAutocomplete.svelte';
	import type { CountryList } from '$lib/server/db/queries';
	import type { ActionData } from './$types';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { data, form }: { data: { countries: CountryList[] }; form: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toastStore.trigger('Success!', 'success');
		} else if (form?.message) {
			toastStore.trigger('Error! ' + form.message, 'error');
		}
	});
</script>

<div class="p-4 max-w-lg">
	<h1 class="font-bold text-lg mb-4">New Drink</h1>

	<div class="card-esc p-4">
		<form method="POST" action="?/drinks" class="space-y-3">
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Name</label>
				<input class="input-box" type="text" name="name" required />
			</div>
			<div class="flex items-center gap-3">
				<input class="checkbox-esc" type="checkbox" name="alcoholic" id="alcoholic" />
				<label for="alcoholic" class="text-sm cursor-pointer">Alcoholic</label>
			</div>
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Alcohol %</label>
				<input class="input-box" type="number" name="percentage" />
			</div>
			<CountryAutocomplete countries={data.countries} />
			<button class="btn-brand w-full py-2 rounded-lg text-sm font-semibold">Create Drink</button>
		</form>
	</div>
</div>

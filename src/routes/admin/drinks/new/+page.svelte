<script lang="ts">
	import CountryAutocomplete from '$lib/components/admin/CountryAutocomplete.svelte';
	import type { CountryList } from '$lib/server/db/queries';
	import type { ActionData } from './$types';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { data, form }: { data: { countries: CountryList[] }; form: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toastStore.trigger('Success! 🎉', 'success');
		} else if (form?.message) {
			toastStore.trigger('Error! ' + form.message, 'error');
		}
	});
</script>

<div class="card m-3 p-3">
	<form method="POST" action="?/drinks" class="space-y-3">
		<label>
			Name
			<input class="input" type="text" name="name" required />
		</label>
		<label>
			Alcoholic
			<input class="checkbox" type="checkbox" name="alcoholic" />
		</label>
		<label>
			Percentage
			<input class="input" type="number" name="percentage" />
		</label>
		<CountryAutocomplete countries={data.countries} />
		<button class="btn variant-glass-primary">Create Drink</button>
	</form>
</div>

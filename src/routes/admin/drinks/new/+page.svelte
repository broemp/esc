<script lang="ts">
	import CountryAutocomplete from '$lib/components/admin/CountryAutocomplete.svelte';
	import type { CountryList } from '$lib/server/db/querys';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types';

	const toastStore = getToastStore();
	export let data: { countries: CountryList };
	export let form: ActionData;

	if (form?.success) {
		const t: ToastSettings = {
			message: 'Success! 🎉',
			// Provide any utility or variant background style:
			background: 'variant-filled-success'
		};
		toastStore.trigger(t);
	} else if (form?.message) {
		const t: ToastSettings = {
			message: 'Error!' + form.message,
			// Provide any utility or variant background style:
			background: 'variant-filled-error'
		};
		toastStore.trigger(t);
	}
</script>

<div class="card m-3 p-3">
	<form method="POST" action="?/drinks" class="space-y-3">
		<label
			>Name
			<input class="input" type="text" name="name" required />
		</label>
		<label>
			Alcoholic
			<input class="checkbox" type="checkbox" name="alcoholic" /></label
		>
		<label>
			Percentage
			<input class="input" type="number" name="percentage" /></label
		>
		<CountryAutocomplete countries={data.countries}></CountryAutocomplete>
		<button class="btn variant-glass-primary">Create Act</button>
	</form>
</div>

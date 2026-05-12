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
	<form method="POST" action="?/act" class="space-y-3">
		<label>
			Position
			<input class="input" type="number" name="position" />
		</label>
		<label>
			Song
			<input class="input" type="text" name="title" required />
		</label>
		<label>
			Artist
			<input class="input" type="text" name="artist" required />
		</label>
		<label>
			Picture URL
			<input class="input" type="url" name="picture_url" required />
		</label>
		<CountryAutocomplete countries={data.countries} />
		<button class="btn variant-glass-primary">Create Act</button>
	</form>
</div>

<div class="card m-3 p-3">
	<form method="POST" action="?/country" class="space-y-3">
		<label>
			Country Name
			<input class="input" type="text" name="name" required />
		</label>
		<label>
			Country Code
			<input class="input" type="text" name="code" required />
		</label>
		<label>
			Image URL
			<input class="input" type="text" name="image" />
		</label>
		<button class="btn variant-glass-primary">Create Country</button>
	</form>
</div>

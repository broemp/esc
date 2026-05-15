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

<div class="p-4 max-w-lg space-y-4">
	<h1 class="font-bold text-lg">New Act</h1>

	<div class="card-esc p-4">
		<form method="POST" action="?/act" class="space-y-3">
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Position</label>
				<input class="input-box" type="number" name="position" />
			</div>
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Song Title</label>
				<input class="input-box" type="text" name="title" required />
			</div>
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Artist</label>
				<input class="input-box" type="text" name="artist" required />
			</div>
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Picture URL</label>
				<input class="input-box" type="url" name="picture_url" required />
			</div>
			<CountryAutocomplete countries={data.countries} />
			<button class="btn-brand w-full py-2 rounded-lg text-sm font-semibold">Create Act</button>
		</form>
	</div>

	<div class="card-esc p-4">
		<h2 class="font-semibold text-sm mb-3">Create Country</h2>
		<form method="POST" action="?/country" class="space-y-3">
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Country Name</label>
				<input class="input-box" type="text" name="name" required />
			</div>
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Country Code</label>
				<input class="input-box" type="text" name="code" required />
			</div>
			<div>
				<label class="block text-xs uppercase tracking-widest mb-1" style="color: oklch(0.50 0 0);">Image URL</label>
				<input class="input-box" type="text" name="image" />
			</div>
			<button class="btn-outline-brand w-full py-2 rounded-lg text-sm font-semibold">Create Country</button>
		</form>
	</div>
</div>

<script lang="ts">
	import ActEditor from '$lib/components/admin/ActEditor.svelte';
	import ActList from '$lib/components/admin/ActList.svelte';
	import type { ActList as ActListDB, CountryList } from '$lib/server/db/queries';
	import type { ActionData } from './$types';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { data, form }: { data: { acts: ActListDB[] | null; countries: CountryList[] }; form: ActionData } =
		$props();

	let actID = $state('');

	$effect(() => {
		if (form?.success) {
			if (form.act?.[0]?.id) actID = form.act[0].id;
			toastStore.trigger('Success! 🎉', 'success');
		} else if (form !== null && form !== undefined && !form?.success) {
			toastStore.trigger('Error!', 'error');
		}
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
	<div class="md:col-span-2">
		<ActEditor {actID} countries={data.countries} />
	</div>
	<div class="md:col-span-1">
		<a href="/admin/acts/new">
			<button class="btn variant-glass-primary w-full mb-2">New Act</button>
		</a>
		<ActList acts={data.acts} bind:selectedAct={actID} />
	</div>
</div>

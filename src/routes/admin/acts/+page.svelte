<script lang="ts">
	import ActEditor from '$lib/components/admin/ActEditor.svelte';
	import ActList from '$lib/components/admin/ActList.svelte';
	import type { ActList as ActListDB, CountryList } from '$lib/server/db/queries';
	import type { ActionData } from './$types';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	export let data: { acts: ActListDB | null; countries: CountryList };
	let actID = '';

	export let form: ActionData;

	if (form?.success) {
		const t: ToastSettings = {
			message: 'Success! 🎉',
			background: 'variant-filled-success'
		};

		if (form.act?.id != undefined) {
			actID = form.act.id;
		}

		toastStore.trigger(t);
	} else {
		const t: ToastSettings = {
			message: 'Error!',
			background: 'variant-filled-error'
		};
		toastStore.trigger(t);
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
	<div class="md:col-span-2">
		<ActEditor {actID} countries={data.countries} />
	</div>
	<div class="md:col-span-1">
		<a href="/admin/acts/new">
			<button class="btn variant-glass-primary w-full mb-2">New Act</button>
		</a>
		<ActList acts={data.acts} bind:selectedAct={actID}></ActList>
	</div>
</div>

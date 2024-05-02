<script lang="ts">
	import ActEditor from '$lib/components/admin/ActEditor.svelte';
	import ActList from '$lib/components/admin/ActList.svelte';
	import type { ActList as ActListDB, CountryList } from '$lib/server/db/querys';
	import type { ActionData } from '../$types';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	export let data: { acts: ActListDB | null; countries: CountryList };
	let actID = '';

	export let form: ActionData = {};

	if (form?.success) {
		const t: ToastSettings = {
			message: 'Success! 🎉',
			// Provide any utility or variant background style:
			background: 'variant-filled-success'
		};
		actID = form.act.id;
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

<div class="grid grid-cols-3 m-4">
	<div class="col-span-2">
		<ActEditor {actID} countries={data.countries} />
	</div>
	<div class="col-span-1">
		<a href="/admin/acts/new">
			<button class="btn variant-glass-primary w-full mb-2">New Act</button>
		</a>
		<ActList acts={data.acts} bind:selectedAct={actID}></ActList>
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;
	const toastStore = getToastStore();

	if (form?.success) {
		const t: ToastSettings = {
			message: 'Success! 🎉',
			background: 'variant-filled-success'
		};
		toastStore.trigger(t);
	}
</script>

<div class="flex justify-center pt-4 space-y-4">
	<form method="post" use:enhance>
		<label class="pb-4">
			Username
			<input class="input" name="username" bind:value={data.user.name} />
		</label>
		<button class="btn variant-soft-primary flex justify-center w-full">Submit</button>
	</form>
</div>

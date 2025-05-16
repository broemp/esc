<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	async function deleteAllVotes() {
		if (!confirm('Are you sure you want to delete ALL votes? This action cannot be undone.')) {
			return;
		}

		try {
			const response = await fetch('/admin/votes', {
				method: 'DELETE'
			});

			if (response.ok) {
				const t: ToastSettings = {
					message: 'All votes have been deleted successfully',
					background: 'variant-filled-success'
				};
				toastStore.trigger(t);
			} else {
				const t: ToastSettings = {
					message: 'Failed to delete votes',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			}
		} catch (error) {
			const t: ToastSettings = {
				message: 'Error deleting votes',
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
	<div class="card p-4">
		<h2 class="text-xl font-semibold mb-4">Danger Zone</h2>
		<button
			class="btn variant-filled-error"
			on:click={deleteAllVotes}
		>
			Delete All Votes
		</button>
	</div>
</div>

<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
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

	<!-- Overview Panel -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<!-- Users Stats -->
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Users</h3>
					<p class="text-3xl font-bold">{data.stats.totalUsers}</p>
				</div>
				<div class="text-4xl text-primary-500">
					<i class="fa-solid fa-users"></i>
				</div>
			</div>
		</div>

		<!-- Groups Stats -->
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Groups</h3>
					<p class="text-3xl font-bold">{data.stats.totalGroups}</p>
				</div>
				<div class="text-4xl text-primary-500">
					<i class="fa-solid fa-user-group"></i>
				</div>
			</div>
		</div>

		<!-- Acts Stats -->
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Acts</h3>
					<p class="text-3xl font-bold">{data.stats.totalActs}</p>
				</div>
				<div class="text-4xl text-primary-500">
					<i class="fa-solid fa-music"></i>
				</div>
			</div>
		</div>

		<!-- Categories Stats -->
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Categories</h3>
					<p class="text-3xl font-bold">{data.stats.totalCategories}</p>
				</div>
				<div class="text-4xl text-primary-500">
					<i class="fa-solid fa-tags"></i>
				</div>
			</div>
		</div>
	</div>

	<!-- Danger Zone -->
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

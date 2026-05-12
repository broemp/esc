<script lang="ts">
	import type { PageData } from './$types';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { data }: { data: PageData } = $props();

	async function deleteAllVotes() {
		if (!confirm('Are you sure you want to delete ALL votes? This action cannot be undone.')) return;
		try {
			const res = await fetch('/admin/votes', { method: 'DELETE' });
			if (res.ok) {
				toastStore.trigger('All votes have been deleted successfully', 'success');
			} else {
				toastStore.trigger('Failed to delete votes', 'error');
			}
		} catch {
			toastStore.trigger('Error deleting votes', 'error');
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Users</h3>
					<p class="text-3xl font-bold">{data.stats.totalUsers}</p>
				</div>
				<div class="text-4xl text-[var(--color-primary-500)]">
					<i class="fa-solid fa-users"></i>
				</div>
			</div>
		</div>
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Groups</h3>
					<p class="text-3xl font-bold">{data.stats.totalGroups}</p>
				</div>
				<div class="text-4xl text-[var(--color-primary-500)]">
					<i class="fa-solid fa-user-group"></i>
				</div>
			</div>
		</div>
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Acts</h3>
					<p class="text-3xl font-bold">{data.stats.totalActs}</p>
				</div>
				<div class="text-4xl text-[var(--color-primary-500)]">
					<i class="fa-solid fa-music"></i>
				</div>
			</div>
		</div>
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Categories</h3>
					<p class="text-3xl font-bold">{data.stats.totalCategories}</p>
				</div>
				<div class="text-4xl text-[var(--color-primary-500)]">
					<i class="fa-solid fa-tags"></i>
				</div>
			</div>
		</div>
	</div>

	<div class="card p-4">
		<h2 class="text-xl font-semibold mb-4">Danger Zone</h2>
		<button class="btn variant-filled-error" onclick={deleteAllVotes}>Delete All Votes</button>
	</div>
</div>

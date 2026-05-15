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

	const stats = [
		{ label: 'Users', value: data.stats.totalUsers, icon: 'fa-users' },
		{ label: 'Groups', value: data.stats.totalGroups, icon: 'fa-user-group' },
		{ label: 'Acts', value: data.stats.totalActs, icon: 'fa-music' },
		{ label: 'Categories', value: data.stats.totalCategories, icon: 'fa-tags' },
	];
</script>

<div class="p-6 max-w-4xl">
	<h1 class="font-bold text-xl mb-6" style="color: oklch(0.97 0 0);">Dashboard</h1>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
		{#each stats as stat}
			<div class="card-esc p-4">
				<i class="fa-solid {stat.icon} text-gradient text-xl mb-2 block"></i>
				<p class="text-gradient font-bold text-3xl leading-none">{stat.value}</p>
				<p class="text-xs mt-1.5 uppercase tracking-wide" style="color: oklch(0.50 0 0);">{stat.label}</p>
			</div>
		{/each}
	</div>

	<div class="card-esc p-4">
		<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.55 0.15 20);">Danger Zone</p>
		<button
			onclick={deleteAllVotes}
			class="px-4 py-2 rounded-lg text-sm font-semibold text-white"
			style="background: oklch(0.38 0.22 20);"
		>
			Delete All Votes
		</button>
	</div>
</div>

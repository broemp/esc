<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { data, form }: { data: PageData; form: { statsEnabled?: boolean; error?: string } | null } = $props();

	let statsEnabled = $state(data.statsEnabled);

	$effect(() => {
		if (!form) return;
		if (form.error) {
			toastStore.trigger(form.error, 'error');
		} else if (typeof form.statsEnabled === 'boolean') {
			statsEnabled = form.statsEnabled;
		}
	});

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

	<!-- Settings -->
	<div class="card-esc p-4 mb-4">
		<p class="text-xs uppercase tracking-widest mb-4" style="color: oklch(0.55 0 0);">Settings</p>
		<form method="POST" action="?/toggleStats" use:enhance={() => {
			return ({ result, update }) => {
				if (result.type === 'failure') {
					toastStore.trigger((result.data as any)?.error ?? 'Failed to update setting', 'error');
				} else {
					update({ reset: false });
				}
			};
		}}>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium">Stats page</p>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">
						Disable if queries are too slow
					</p>
				</div>
				<button
					type="submit"
					class="w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0"
					style={statsEnabled
						? 'background: var(--gradient-brand);'
						: 'background: oklch(0.20 0 0);'}
					aria-label="Toggle stats"
				>
					<span
						class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
						style="background: oklch(0.97 0 0); transform: translateX({statsEnabled ? '20px' : '0px'});"
					></span>
				</button>
			</div>
		</form>
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

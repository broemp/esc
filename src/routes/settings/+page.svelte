<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { toastStore } from '$lib/stores/toast.svelte';

	let {
		data,
		form
	}: {
		data: PageServerData & { user: { name: string; image?: string; createdAt: string } };
		form: ActionData & { success?: boolean };
	} = $props();

	let username = $state(data.user.name);

	$effect(() => {
		if (form?.success) {
			toastStore.trigger('Saved!', 'success');
		}
	});
</script>

<div class="max-w-md mx-auto px-4 pt-6 pb-6">
	<h1 class="text-gradient font-bold text-2xl tracking-tight mb-1">Settings</h1>
	<div class="gradient-line mb-6"></div>

	<!-- User card -->
	<div class="card-esc p-4 flex items-center gap-4 mb-6">
		{#if data.user?.image}
			<img
				src={data.user.image}
				alt={data.user.name || 'User avatar'}
				class="w-14 h-14 rounded-full object-cover shrink-0"
			/>
		{:else}
			<div
				class="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
				style="background: var(--gradient-brand);"
			>
				<span class="text-xl font-bold text-white">
					{data.user?.name?.[0]?.toUpperCase() || '?'}
				</span>
			</div>
		{/if}
		<div>
			<p class="font-semibold text-sm">{data.user?.name || 'Anonymous User'}</p>
			<p class="text-xs" style="color: oklch(0.50 0 0);">
				Member since {new Date(data.user?.createdAt).toLocaleDateString()}
			</p>
		</div>
	</div>

	<form method="post" use:enhance class="space-y-6">
		<div>
			<label for="username" class="block text-xs uppercase tracking-widest mb-2" style="color: oklch(0.50 0 0);">
				Username
			</label>
			<input
				id="username"
				class="input-esc"
				name="username"
				bind:value={username}
				placeholder="Your display name"
			/>
		</div>

		<button class="btn-brand w-full h-12 rounded-xl text-base font-semibold">
			Save Changes
		</button>
	</form>
</div>

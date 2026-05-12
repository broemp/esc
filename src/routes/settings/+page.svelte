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
			toastStore.trigger('Success! 🎉', 'success');
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="bg-gradient-to-br from-red-900 to-black rounded-lg shadow-lg p-6 text-white">
		<div class="flex items-center space-x-4 mb-8">
			{#if data.user?.image}
				<img
					src={data.user.image}
					alt={data.user.name || 'User avatar'}
					class="w-24 h-24 rounded-full object-cover border-4 border-white"
				/>
			{:else}
				<div
					class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white"
				>
					<span class="text-4xl text-gray-500">
						{data.user?.name?.[0]?.toUpperCase() || '?'}
					</span>
				</div>
			{/if}
			<div>
				<h1 class="text-3xl font-bold">{data.user?.name || 'Anonymous User'}</h1>
				<p class="text-gray-300">
					Member since {new Date(data.user?.createdAt).toLocaleDateString()}
				</p>
			</div>
		</div>
		<div class="mt-8">
			<h2 class="text-2xl font-semibold mb-4">Settings</h2>
			<form method="post" use:enhance class="space-y-4">
				<label class="block">
					<span class="text-gray-300">Username</span>
					<input
						class="input w-full mt-1 bg-white/10 border-white/20 text-white"
						name="username"
						bind:value={username}
					/>
				</label>
				<button class="btn variant-filled-primary w-full">Update Profile</button>
			</form>
		</div>
	</div>
</div>

<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast.svelte';

	let {
		data,
		form
	}: {
		data: PageServerData & { user: { name: string; image?: string; createdAt: string } };
		form: { success?: boolean; user?: { name: string } };
	} = $props();

	let username = $state(data.user.name);

	$effect(() => {
		if (form?.success && form?.user) {
			username = form.user.name;
			toastStore.trigger('Username updated successfully! 🎉', 'success');
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="bg-gradient-to-br from-red-900 to-black rounded-lg shadow-lg p-6 text-white">
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-3xl font-bold">Settings</h1>
			<button
				class="btn variant-ghost-surface"
				onclick={() => goto('/user/' + $page.data.session?.user?.id)}
			>
				<i class="fa-solid fa-arrow-left mr-2"></i> Back
			</button>
		</div>
		<div class="mt-8">
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

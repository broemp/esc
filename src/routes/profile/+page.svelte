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
			toastStore.trigger('Username updated successfully!', 'success');
		}
	});
</script>

<div class="max-w-md mx-auto px-4 pt-6 pb-6">
	<div class="flex items-center justify-between mb-1">
		<h1 class="text-gradient font-bold text-2xl tracking-tight">Edit Profile</h1>
		<button
			class="btn-ghost p-2 rounded-lg text-sm"
			onclick={() => goto('/user/' + $page.data.session?.user?.id)}
		>
			<i class="fa-solid fa-arrow-left mr-1.5"></i>Back
		</button>
	</div>
	<div class="gradient-line mb-6"></div>

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
			Update Profile
		</button>
	</form>
</div>

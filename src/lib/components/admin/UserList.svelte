<script lang="ts">
	import type { User } from '$lib/types';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { goto } from '$app/navigation';

	let {
		users = $bindable<User[]>(),
		totalUsers,
		currentPage,
		limit
	}: {
		users: User[];
		totalUsers: number;
		currentPage: number;
		limit: number;
	} = $props();

	const totalPages = $derived(Math.ceil(totalUsers / limit));

	async function handleDelete(userId: string) {
		if (!confirm('Are you sure you want to delete this user?')) return;
		try {
			const res = await fetch(`/admin/users/${userId}`, { method: 'DELETE' });
			if (res.ok) {
				users = users.filter((u) => u.id !== userId);
				toastStore.trigger('User deleted successfully', 'success');
			} else {
				toastStore.trigger('Failed to delete user', 'error');
			}
		} catch {
			toastStore.trigger('Error deleting user', 'error');
		}
	}

	async function toggleAdmin(user: User) {
		const newRole = user.role === 'admin' ? 'user' : 'admin';
		try {
			const res = await fetch(`/admin/users/${user.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: newRole })
			});
			if (res.ok) {
				users = users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u));
				toastStore.trigger(`User role updated to ${newRole}`, 'success');
			} else {
				toastStore.trigger('Failed to update user role', 'error');
			}
		} catch {
			toastStore.trigger('Error updating user role', 'error');
		}
	}
</script>

<div class="card">
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr>
					<th class="px-4 md:px-6">Name</th>
					<th class="px-4 md:px-6">Email</th>
					<th class="px-4 md:px-6">Role</th>
					<th class="px-4 md:px-6">Created At</th>
					<th class="px-4 md:px-6">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user}
					<tr>
						<td class="px-4 md:px-6">{user.name || 'N/A'}</td>
						<td class="px-4 md:px-6">{user.email}</td>
						<td class="px-4 md:px-6">{user.role}</td>
						<td class="px-4 md:px-6">{new Date(user.createdAt).toLocaleDateString()}</td>
						<td class="px-4 md:px-6 flex flex-col md:flex-row gap-2">
							<button
								class="btn btn-sm preset-tonal-primary"
								onclick={() => goto(`/user/${user.id}`)}
							>
								View Profile
							</button>
							<button
								class="btn btn-sm {user.role === 'admin' ? 'preset-filled-error-500' : 'preset-filled-primary-500'}"
								onclick={() => toggleAdmin(user)}
							>
								{user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
							</button>
							<button class="btn btn-sm preset-filled-error-500" onclick={() => handleDelete(user.id)}>
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="flex justify-center gap-2 mt-4">
		{#if currentPage > 1}
			<a href="?page={currentPage - 1}" class="btn btn-sm">Previous</a>
		{/if}
		<span class="btn btn-sm">Page {currentPage} of {totalPages}</span>
		{#if currentPage < totalPages}
			<a href="?page={currentPage + 1}" class="btn btn-sm">Next</a>
		{/if}
	</div>
</div>

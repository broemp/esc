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

<div class="card-esc overflow-x-auto">
	<table class="table-esc">
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th>Role</th>
				<th>Created</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				<tr>
					<td class="font-medium">{user.name || 'N/A'}</td>
					<td style="color: oklch(0.60 0 0);">{user.email}</td>
					<td>
						<span class="text-xs px-2 py-0.5 rounded font-semibold"
							style={user.role === 'admin'
								? 'background: oklch(0.62 0.28 0 / 0.15); color: oklch(0.75 0.22 0);'
								: 'background: oklch(0.15 0 0); color: oklch(0.50 0 0);'}>
							{user.role}
						</span>
					</td>
					<td style="color: oklch(0.55 0 0);">{new Date(user.createdAt).toLocaleDateString()}</td>
					<td>
						<div class="flex flex-wrap gap-1.5">
							<button
								class="btn-ghost text-xs px-2 py-1 rounded"
								onclick={() => goto(`/user/${user.id}`)}
							>
								View
							</button>
							<button
								class="text-xs px-2 py-1 rounded font-semibold"
								style={user.role === 'admin'
									? 'background: oklch(0.38 0.22 20 / 0.3); color: oklch(0.70 0.20 20);'
									: 'background: oklch(0.62 0.28 0 / 0.15); color: oklch(0.75 0.22 0);'}
								onclick={() => toggleAdmin(user)}
							>
								{user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
							</button>
							<button
								class="text-xs px-2 py-1 rounded font-semibold text-white"
								style="background: oklch(0.38 0.22 20);"
								onclick={() => handleDelete(user.id)}
							>
								Delete
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="flex justify-center gap-2 mt-4 text-sm">
	{#if currentPage > 1}
		<a href="?page={currentPage - 1}" class="btn-ghost px-3 py-1.5 rounded">Previous</a>
	{/if}
	<span class="px-3 py-1.5 rounded" style="color: oklch(0.55 0 0);">
		Page {currentPage} of {totalPages}
	</span>
	{#if currentPage < totalPages}
		<a href="?page={currentPage + 1}" class="btn-ghost px-3 py-1.5 rounded">Next</a>
	{/if}
</div>

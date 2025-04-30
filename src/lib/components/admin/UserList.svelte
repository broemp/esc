<script lang="ts">
	import { enhance } from '$app/forms';
	import type { User } from '$lib/types';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const toastStore = getToastStore();
	export let users: User[];
	export let totalUsers: number;
	export let currentPage: number;
	export let limit: number;

	const totalPages = Math.ceil(totalUsers / limit);

	async function handleDelete(userId: string) {
		if (!confirm('Are you sure you want to delete this user?')) return;

		try {
			const response = await fetch(`/admin/users/${userId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				users = users.filter((user) => user.id !== userId);
				const t: ToastSettings = {
					message: 'User deleted successfully',
					background: 'variant-filled-success'
				};
				toastStore.trigger(t);
			} else {
				const t: ToastSettings = {
					message: 'Failed to delete user',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			}
		} catch (error) {
			const t: ToastSettings = {
				message: 'Error deleting user',
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	}

	async function toggleAdmin(user: User) {
		const newRole = user.role === 'admin' ? 'user' : 'admin';
		try {
			const response = await fetch(`/admin/users/${user.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: newRole })
			});

			if (response.ok) {
				user.role = newRole;
				const t: ToastSettings = {
					message: `User role updated to ${newRole}`,
					background: 'variant-filled-success'
				};
				toastStore.trigger(t);
			} else {
				const t: ToastSettings = {
					message: 'Failed to update user role',
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			}
		} catch (error) {
			const t: ToastSettings = {
				message: 'Error updating user role',
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	}
</script>

<div class="card">
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user}
					<tr>
						<td>{user.name || 'N/A'}</td>
						<td>{user.email}</td>
						<td>{user.role}</td>
						<td>{new Date(user.createdAt).toLocaleDateString()}</td>
						<td class="flex gap-2">
							<button
								class="btn btn-sm {user.role === 'admin' ? 'variant-filled-error' : 'variant-filled-primary'}"
								on:click={() => toggleAdmin(user)}
							>
								{user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
							</button>
							<button
								class="btn btn-sm variant-filled-error"
								on:click={() => handleDelete(user.id)}
							>
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
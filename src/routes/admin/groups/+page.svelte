<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let groups = $state(data.groups);
</script>

<div class="p-4">
	<h1 class="font-bold text-lg mb-4">Manage Groups</h1>

	<div class="space-y-2">
		{#each groups as group}
			<div class="card-esc p-4 flex justify-between items-start gap-4">
				<div class="min-w-0">
					<h3 class="font-semibold text-sm truncate">{group.name}</h3>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">ID: {group.id}</p>
					<p class="text-xs" style="color: oklch(0.45 0 0);">
						Public: {group.public ? 'Yes' : 'No'}
					</p>
				</div>
				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								groups = groups.filter((g) => g.id !== group.id);
							}
						};
					}}
				>
					<input type="hidden" name="groupId" value={group.id} />
					<button
						type="submit"
						class="text-xs px-3 py-1.5 rounded font-semibold text-white shrink-0"
						style="background: oklch(0.38 0.22 20);"
						onclick={(e) => {
							if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
								e.preventDefault();
							}
						}}
					>
						Delete
					</button>
				</form>
			</div>
		{/each}
	</div>
</div>

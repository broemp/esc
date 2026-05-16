<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let groups = $state(data.groups);

	type GroupDetail = {
		members: { username: string | null; userid: string }[];
		categories: ({ id: string; name: string; default: boolean; position: number | null; description: string | null } | null)[];
	};

	let selectedGroupId = $state<string | null>(null);
	let detail = $state<GroupDetail | null>(null);
	let loadingDetail = $state(false);

	async function selectGroup(id: string) {
		if (selectedGroupId === id) return;
		selectedGroupId = id;
		detail = null;
		loadingDetail = true;
		const res = await fetch(`/api/admin/groups/${id}`);
		if (res.ok) {
			detail = await res.json();
		}
		loadingDetail = false;
	}

	const selectedGroup = $derived(groups.find((g) => g.id === selectedGroupId));
</script>

<div class="p-4 h-full">
	<h1 class="font-bold text-lg mb-4">Manage Groups</h1>

	<div class="flex gap-4 h-full" style="min-height: 0;">
		<!-- Left: group list -->
		<div class="w-72 shrink-0 space-y-2 overflow-y-auto">
			{#each groups as group}
				<button
					type="button"
					class="w-full text-left card-esc p-3 transition-colors"
					style={selectedGroupId === group.id ? 'border-color: oklch(0.65 0.22 145); background: oklch(0.18 0.14 145 / 0.15);' : ''}
					onclick={() => selectGroup(group.id)}
				>
					<p class="font-semibold text-sm truncate">{group.name}</p>
					<p class="text-xs mt-0.5" style="color: oklch(0.45 0 0);">
						{group.public ? 'Public' : 'Private'}
					</p>
				</button>
			{/each}

			{#if groups.length === 0}
				<p class="text-sm" style="color: oklch(0.45 0 0);">No groups yet.</p>
			{/if}
		</div>

		<!-- Right: detail panel -->
		<div class="flex-1 min-w-0">
			{#if !selectedGroupId}
				<div class="card-esc p-6 flex items-center justify-center h-48">
					<p class="text-sm" style="color: oklch(0.45 0 0);">Select a group to see details</p>
				</div>
			{:else if loadingDetail}
				<div class="card-esc p-6 flex items-center justify-center h-48">
					<p class="text-sm" style="color: oklch(0.45 0 0);">Loading...</p>
				</div>
			{:else if selectedGroup && detail}
				<div class="card-esc p-5 space-y-5">
					<!-- Header -->
					<div class="flex items-start justify-between gap-4">
						<div>
							<h2 class="font-bold text-base">{selectedGroup.name}</h2>
							<p class="text-xs mt-1 font-mono" style="color: oklch(0.45 0 0);">{selectedGroup.id}</p>
							<div class="flex gap-2 mt-2">
								{#if selectedGroup.public}
									<span class="px-2 py-0.5 rounded text-xs font-semibold" style="background: oklch(0.18 0.14 145 / 0.4); color: oklch(0.65 0.22 145);">Public</span>
								{:else}
									<span class="px-2 py-0.5 rounded text-xs" style="background: oklch(0.15 0 0); color: oklch(0.45 0 0);">Private</span>
								{/if}
								{#if selectedGroup.isDefault}
									<span class="px-2 py-0.5 rounded text-xs font-semibold" style="background: oklch(0.18 0.12 260 / 0.4); color: oklch(0.65 0.18 260);">Default</span>
								{/if}
							</div>
						</div>

						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										groups = groups.filter((g) => g.id !== selectedGroupId);
										selectedGroupId = null;
										detail = null;
									}
								};
							}}
						>
							<input type="hidden" name="groupId" value={selectedGroup.id} />
							<button
								type="submit"
								class="text-xs px-3 py-1.5 rounded font-semibold text-white shrink-0"
								style="background: oklch(0.38 0.22 20);"
								onclick={(e) => {
									if (!confirm('Delete this group? This cannot be undone.')) e.preventDefault();
								}}
							>
								Delete Group
							</button>
						</form>
					</div>

					<!-- Members -->
					<div>
						<h3 class="text-xs uppercase tracking-widest font-semibold mb-2" style="color: oklch(0.50 0 0);">
							Members ({detail.members.filter((m) => m.userid).length})
						</h3>
						{#if detail.members.length === 0 || detail.members.every((m) => !m.userid)}
							<p class="text-sm" style="color: oklch(0.45 0 0);">No members</p>
						{:else}
							<div class="space-y-1">
								{#each detail.members.filter((m) => m.userid) as member}
									<div class="flex items-center gap-2 text-sm">
										<span class="w-2 h-2 rounded-full shrink-0" style="background: oklch(0.65 0.22 145);"></span>
										<span>{member.username ?? 'Unknown'}</span>
										<span class="text-xs font-mono" style="color: oklch(0.45 0 0);">{member.userid}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Categories -->
					<div>
						<h3 class="text-xs uppercase tracking-widest font-semibold mb-2" style="color: oklch(0.50 0 0);">
							Categories ({detail.categories.filter(Boolean).length})
						</h3>
						{#if detail.categories.filter(Boolean).length === 0}
							<p class="text-sm" style="color: oklch(0.45 0 0);">No categories assigned</p>
						{:else}
							<div class="flex flex-wrap gap-2">
								{#each detail.categories.filter(Boolean) as cat}
									<span class="px-2 py-1 rounded text-xs font-medium" style="background: oklch(0.15 0 0); color: oklch(0.70 0 0);">
										{cat!.name}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const votes = data.votes;
	const pagination = data.pagination;

	function formatDate(date: string) {
		return new Date(date).toLocaleString();
	}

	function goToPage(pageNum: number) {
		if (pageNum < 1 || pageNum > pagination.totalPages) return;
		goto(`?page=${pageNum}`);
	}
</script>

<div class="p-4">
	<h1 class="font-bold text-lg mb-4">Vote Management</h1>

	<div class="card-esc overflow-x-auto">
		<table class="table-esc">
			<thead>
				<tr>
					<th>User</th>
					<th>Act</th>
					<th>Category</th>
					<th>Points</th>
					<th>Date</th>
				</tr>
			</thead>
			<tbody>
				{#each votes as vote}
					<tr>
						<td>
							{#if vote.user}
								<button
									class="btn-ghost text-sm"
									onclick={() => vote.user?.id && goto(`/user/${vote.user.id}`)}
								>
									{vote.user?.name || vote.user?.email}
								</button>
							{:else}
								<span style="color: oklch(0.40 0 0);">Deleted User</span>
							{/if}
						</td>
						<td>
							{#if vote.act}
								{vote.act.artist} - {vote.act.title}
							{:else}
								<span style="color: oklch(0.40 0 0);">Deleted Act</span>
							{/if}
						</td>
						<td>
							{#if vote.category}
								{vote.category.name}
							{:else}
								<span style="color: oklch(0.40 0 0);">Deleted Category</span>
							{/if}
						</td>
						<td class="font-semibold">{vote.vote.points}</td>
						<td style="color: oklch(0.50 0 0);">{formatDate(vote.vote.created_at)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="flex justify-between items-center mt-4 text-sm">
		<span style="color: oklch(0.50 0 0);">
			{(pagination.currentPage - 1) * pagination.pageSize + 1}–{Math.min(
				pagination.currentPage * pagination.pageSize,
				pagination.totalCount
			)} of {pagination.totalCount}
		</span>
		<div class="flex gap-1">
			<button
				class="btn-ghost px-3 py-1.5 rounded text-sm"
				disabled={pagination.currentPage === 1}
				onclick={() => goToPage(pagination.currentPage - 1)}
			>
				Prev
			</button>
			{#each Array(pagination.totalPages) as _, i}
				<button
					class="px-3 py-1.5 rounded text-sm font-medium"
					style={pagination.currentPage === i + 1
						? 'background: var(--gradient-brand); color: white;'
						: 'color: oklch(0.50 0 0);'}
					onclick={() => goToPage(i + 1)}
				>
					{i + 1}
				</button>
			{/each}
			<button
				class="btn-ghost px-3 py-1.5 rounded text-sm"
				disabled={pagination.currentPage === pagination.totalPages}
				onclick={() => goToPage(pagination.currentPage + 1)}
			>
				Next
			</button>
		</div>
	</div>
</div>

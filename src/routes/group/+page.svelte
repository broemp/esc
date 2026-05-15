<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="max-w-lg mx-auto px-4 pt-6 pb-6">
	<h1 class="text-gradient font-bold text-2xl tracking-tight mb-4">My Groups</h1>

	<div class="flex gap-3 mb-5">
		<a href="/group/new" class="btn-brand flex-1 h-11 rounded-xl text-sm font-semibold">
			Create Group
		</a>
		<a href="/group/join" class="btn-outline-brand flex-1 h-11 rounded-xl text-sm font-semibold">
			Join Group
		</a>
	</div>

	<div class="gradient-line mb-5"></div>

	{#if data.groups.length > 0}
		<div class="space-y-2">
			{#each data.groups as group}
				<a
					href="/group/{group.group?.id}"
					class="card-esc px-4 py-3.5 flex items-center justify-between hover:border-[oklch(0.30_0_0)] transition-colors block"
				>
					<span class="font-semibold text-sm">{group.group?.name}</span>
					<i class="fa-solid fa-chevron-right text-xs" style="color: oklch(0.40 0 0);"></i>
				</a>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12">
			<i class="fa-solid fa-users-slash text-3xl mb-3" style="color: oklch(0.35 0 0);"></i>
			<p class="text-sm" style="color: oklch(0.48 0 0);">No groups yet — create or join one!</p>
		</div>
	{/if}
</div>

<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const publicGroups = data.publicGroups;
</script>

<div class="max-w-lg mx-auto px-4 pt-6 pb-6">
	<h1 class="text-gradient font-bold text-2xl tracking-tight mb-5">Join a Group</h1>

	<!-- Join by code -->
	<div class="card-esc p-4 space-y-3 mb-6">
		<p class="text-xs uppercase tracking-widest" style="color: oklch(0.42 0 0);">Join by Code</p>
		<form method="POST" class="space-y-3">
			<input
				class="input-esc"
				name="group_id"
				required
				placeholder="Paste invite code"
			/>
			<button type="submit" class="btn-brand w-full h-11 rounded-xl text-sm font-semibold">
				Join
			</button>
		</form>
	</div>

	<!-- Browse public groups -->
	{#if publicGroups.length > 0}
		<div class="gradient-line mb-5"></div>
		<p class="text-xs uppercase tracking-widest mb-3" style="color: oklch(0.42 0 0);">Public Groups</p>
		<div class="space-y-2">
			{#each publicGroups as group}
				<a
					href="/group/join/{group.id}"
					class="card-esc px-4 py-3.5 flex items-center justify-between hover:border-[oklch(0.30_0_0)] transition-colors block"
				>
					<span class="font-semibold text-sm">{group.name}</span>
					<i class="fa-solid fa-arrow-right text-xs" style="color: oklch(0.40 0 0);"></i>
				</a>
			{/each}
		</div>
	{/if}
</div>

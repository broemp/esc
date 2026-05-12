<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="w-full md:w-2/3 mx-auto">
	<p class="flex justify-center pt-2 text-xl underline font-bold">Your Groups</p>
	<div class="flex p-4 gap-4">
		<a href="/group/new" class="btn preset-filled-primary-500 w-1/2">Create new Group</a>
		<a href="/group/join" class="btn preset-filled-primary-500 w-1/2">Join Group</a>
	</div>
	{#if data.groups.length > 0}
		<div class="m-4 space-y-4">
			{#each data.groups as group}
				<a href="/group/{group.group?.id}">
					<div class="card mb-4 p-4 font-bold grid justify-items-center">
						{group.group?.name}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-center m-4">No Groups — create or join one!</p>
	{/if}
</div>

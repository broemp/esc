<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let publicGroups = data.publicGroups;
</script>

<div class="flex justify-center m-2">
	<div class="grid grid-cols-1">
		<h1 class="text-xl text-center">Join Group</h1>
		<form method="POST" class="mt-4">
			<label class="label font-bold">
				<p>Group Code</p>
				<input class="input flex" name="group_id" required />
			</label>
			<div class="flex justify-center mt-2">
				<button type="submit" class="btn w-32 variant-soft-primary">Join!</button>
			</div>
		</form>
	</div>
</div>
<hr class="!border-t-2" />
<div class="grid grid-cols-1 justify-center mx-4 mt-2 space-y-2">
	{#each publicGroups as group}
		<a href="/group/join/{group.id}">
			<div class="card h-8">
				<p class="flex justify-center align-middle font-bold">{group.name}</p>
			</div>
		</a>
	{/each}
</div>

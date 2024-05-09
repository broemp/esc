<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div>
	{#each data.groups as group}
		<div>{group.name}</div>
	{/each}
</div>

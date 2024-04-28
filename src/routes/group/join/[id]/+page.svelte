<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	function joinGroup() {}
</script>

<div class="flex justify-center">
	<div class="grid grid-cols-1 mt-12">
		<h1 class="text-xl text-center">Do you wanna join <br /> {data.group[0].name}</h1>
		<div class="flex justify-center mt-28 space-x-2">
			<btn class="btn variant-glass-primary w-full" role="button" on:click={joinGroup}>Yes</btn>
			<a href="/" class="btn variant-glass-warning w-full"> No </a>
		</div>
	</div>
</div>

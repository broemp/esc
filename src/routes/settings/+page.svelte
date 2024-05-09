<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="flex justify-center pt-4 space-y-4">
	<form method="post">
		<label class="pb-4">
			Username
			<input class="input" bind:value={data.user.name} />
		</label>
		<button class="btn variant-soft-primary flex justify-center w-full">Submit</button>
	</form>
</div>

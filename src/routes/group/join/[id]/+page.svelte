<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();

	const groupID = data.group.group.id;
	const group = data.group.group;

	async function joinGroup() {
		const resp = await fetch('/group/join/' + groupID, { method: 'POST' });
		if (resp.status === 200) {
			goto('/group/' + groupID);
		} else {
			goto('/');
		}
	}
</script>

<div class="flex h-screen justify-center">
	<div class="m-auto">
		<div class="grid grid-cols-1 mt-12">
			<h1 class="text-xl text-center">Do you wanna join <br /> {group.name}?</h1>
			<div class="flex justify-center mt-16 space-x-2">
				<button
					type="button"
					class="btn variant-glass-primary w-full"
					onclick={joinGroup}
				>
					Yes
				</button>
				<a href="/" class="btn variant-filled-warning w-full">No</a>
			</div>
		</div>
	</div>
</div>

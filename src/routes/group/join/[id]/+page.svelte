<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	let groupID = data.slug;
	let groupName = data.group.name;

	async function joinGroup() {
		let resp = await fetch('/group/join/' + groupID, {
			method: 'POST'
		});
		switch (resp.status) {
			case 200:
				goto('/group/' + groupID);
			default:
				goto('/');
		}
	}
</script>

<div class="flex justify-center">
	<div class="grid grid-cols-1 mt-12">
		<h1 class="text-xl text-center">Do you wanna join <br /> {groupName}</h1>
		<div class="flex justify-center mt-28 space-x-2">
			<btn
				type="submit"
				name="button-yes"
				class="btn variant-glass-primary w-full"
				on:click={() => joinGroup()}>Yes</btn
			>
			<a href="/" class="btn variant-glass-warning w-full"> No </a>
		</div>
	</div>
</div>

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

<div class="flex min-h-[85vh] items-center justify-center px-6">
	<div class="text-center space-y-6 max-w-xs w-full">
		<i class="fa-solid fa-user-group text-5xl text-gradient"></i>

		<div>
			<h1 class="font-bold text-2xl leading-tight mb-2">Join {group.name}?</h1>
			<p class="text-sm" style="color: oklch(0.55 0 0);">
				Become a member and start voting with this group.
			</p>
		</div>

		<div class="flex gap-3 w-full">
			<button
				type="button"
				onclick={joinGroup}
				class="btn-brand flex-1 h-12 rounded-xl text-sm font-semibold"
			>
				Join
			</button>
			<a
				href="/"
				class="btn-outline-brand flex-1 h-12 rounded-xl text-sm font-semibold"
			>
				Cancel
			</a>
		</div>
	</div>
</div>

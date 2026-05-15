<script lang="ts">
	import UserList from '$lib/components/admin/UserList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="p-4">
	<h1 class="font-bold text-lg mb-4">User Management</h1>
	<UserList
		users={data.users}
		totalUsers={data.totalUsers}
		currentPage={data.currentPage}
		limit={data.limit}
	/>
</div>

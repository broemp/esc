<script lang="ts">
	import UserList from '$lib/components/admin/UserList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">User Management</h1>
	<UserList 
		users={data.users} 
		totalUsers={data.totalUsers}
		currentPage={data.currentPage}
		limit={data.limit}
	/>
</div>

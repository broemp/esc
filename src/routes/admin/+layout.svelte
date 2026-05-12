<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<div class="flex flex-col md:grid md:grid-cols-6 gap-4 h-full">
	<div class="md:col-span-1 bg-gradient-to-br from-surface-800 to-surface-900 p-4 shadow-lg">
		<div class="flex flex-col space-y-4">
			<div class="text-xl font-bold text-white mb-6">Admin Panel</div>
			<div
				class="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible"
			>
				{#each [['acts', 'Acts'], ['users', 'Users'], ['votes', 'Votes'], ['drinks', 'Drinks'], ['categories', 'Categories'], ['groups', 'Groups']] as [path, label]}
					<a
						class="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-white/10 whitespace-nowrap {$page.url.pathname === '/admin/' + path ? 'bg-white/10' : ''}"
						href="/admin/{path}"
					>
						<span class="text-white">{label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="md:col-span-5 h-full">
		{@render children()}
	</div>
</div>

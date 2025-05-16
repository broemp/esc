<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-col md:grid md:grid-cols-6 gap-4 h-full">
	<div class="md:col-span-1 bg-gradient-to-br from-surface-800 to-surface-900 p-4 shadow-lg">
		<div class="flex flex-col space-y-4">
			<div class="text-xl font-bold text-white mb-6">Admin Panel</div>
			<div class="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
				<a 
					class="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-700 whitespace-nowrap {($page.url.pathname === '/admin/acts') ? 'bg-surface-700' : ''}" 
					href="/admin/acts"
				>
					<span class="text-white">Acts</span>
				</a>
				<a 
					class="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-700 whitespace-nowrap {($page.url.pathname === '/admin/users') ? 'bg-surface-700' : ''}" 
					href="/admin/users"
				>
					<span class="text-white">Users</span>
				</a>
				<a 
					class="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-700 whitespace-nowrap {($page.url.pathname === '/admin/drinks') ? 'bg-surface-700' : ''}" 
					href="/admin/drinks"
				>
					<span class="text-white">Drinks</span>
				</a>
				<a 
					class="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-700 whitespace-nowrap {($page.url.pathname === '/admin/categories') ? 'bg-surface-700' : ''}" 
					href="/admin/categories"
				>
					<span class="text-white">Categories</span>
				</a>
			</div>
		</div>
	</div>
	<div class="md:col-span-5 h-full">
		<slot />
	</div>
</div>

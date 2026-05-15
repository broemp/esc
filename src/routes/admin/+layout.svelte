<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const navItems: [string, string, string][] = [
		['acts', 'Acts', 'fa-music'],
		['users', 'Users', 'fa-users'],
		['votes', 'Votes', 'fa-check-to-slot'],
		['drinks', 'Drinks', 'fa-martini-glass'],
		['categories', 'Categories', 'fa-tags'],
		['groups', 'Groups', 'fa-user-group'],
	];
</script>

<div class="flex flex-col md:flex-row min-h-screen">
	<!-- Sidebar -->
	<aside
		class="md:w-48 shrink-0"
		style="background: oklch(0.07 0 0); border-right: 1px solid oklch(0.12 0 0);"
	>
		<div class="p-4">
			<p class="text-gradient font-bold text-sm uppercase tracking-widest mb-5">Admin</p>

			<nav class="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
				{#each navItems as [path, label, icon]}
					{@const isActive = $page.url.pathname === '/admin/' + path}
					<a
						href="/admin/{path}"
						class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
						style={isActive
							? 'color: oklch(0.97 0 0); background: oklch(0.12 0 0);'
							: 'color: oklch(0.45 0 0);'}
						onmouseenter={(e) => { if (!isActive) e.currentTarget.style.color = 'oklch(0.75 0 0)'; }}
						onmouseleave={(e) => { if (!isActive) e.currentTarget.style.color = 'oklch(0.45 0 0)'; }}
					>
						{#if isActive}
							<div class="w-0.5 h-4 rounded-full shrink-0" style="background: var(--gradient-brand-vertical);"></div>
						{:else}
							<div class="w-0.5 h-4 shrink-0"></div>
						{/if}
						<i class="fa-solid {icon} text-xs w-4 text-center"></i>
						<span>{label}</span>
					</a>
				{/each}
			</nav>
		</div>
	</aside>

	<!-- Content -->
	<div class="flex-1 overflow-auto">
		{@render children()}
	</div>
</div>

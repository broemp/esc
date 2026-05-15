<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: path = $page.url.pathname;
	$: isHome = path === '/';
	$: isVote = path.startsWith('/vote');
	$: isGroup = path.startsWith('/group');
	$: isProfile = path.startsWith('/user');

	const navItems = [
		{ href: '/', icon: 'fa-house', label: 'Home', active: false },
		{ href: '/vote', icon: 'fa-check-to-slot', label: 'Vote', active: false },
		{ href: '/group', icon: 'fa-user-group', label: 'Groups', active: false },
		{ href: '/user/', icon: 'fa-user', label: 'Profile', active: false }
	];
</script>

{#if $page.data.session}
	<nav
		class="fixed bottom-0 z-50 w-full"
		style="background: oklch(0.06 0 0 / 0.95); border-top: 1px solid oklch(0.14 0 0); backdrop-filter: blur(16px);"
	>
		<div class="flex items-stretch justify-around max-w-lg mx-auto">
			<button
				onclick={() => goto('/')}
				aria-label="Home"
				class="flex flex-col items-center justify-center gap-1 flex-1 py-3 relative transition-colors"
				style={isHome ? 'color: oklch(0.97 0 0);' : 'color: oklch(0.42 0 0);'}
			>
				{#if isHome}
					<div
						class="absolute top-0 left-1/2 -translate-x-1/2 w-8 rounded-b-sm"
						style="height: 2px; background: var(--gradient-brand-horizontal);"
					></div>
				{/if}
				<i class="fa-solid fa-house text-base"></i>
				<span class="text-[10px] font-semibold tracking-widest uppercase">Home</span>
			</button>

			<button
				onclick={() => goto('/vote')}
				aria-label="Vote"
				class="flex flex-col items-center justify-center gap-1 flex-1 py-3 relative transition-colors"
				style={isVote ? 'color: oklch(0.97 0 0);' : 'color: oklch(0.42 0 0);'}
			>
				{#if isVote}
					<div
						class="absolute top-0 left-1/2 -translate-x-1/2 w-8 rounded-b-sm"
						style="height: 2px; background: var(--gradient-brand-horizontal);"
					></div>
				{/if}
				<i class="fa-solid fa-check-to-slot text-base"></i>
				<span class="text-[10px] font-semibold tracking-widest uppercase">Vote</span>
			</button>

			<button
				onclick={() => goto('/group')}
				aria-label="Groups"
				class="flex flex-col items-center justify-center gap-1 flex-1 py-3 relative transition-colors"
				style={isGroup ? 'color: oklch(0.97 0 0);' : 'color: oklch(0.42 0 0);'}
			>
				{#if isGroup}
					<div
						class="absolute top-0 left-1/2 -translate-x-1/2 w-8 rounded-b-sm"
						style="height: 2px; background: var(--gradient-brand-horizontal);"
					></div>
				{/if}
				<i class="fa-solid fa-user-group text-base"></i>
				<span class="text-[10px] font-semibold tracking-widest uppercase">Groups</span>
			</button>

			<button
				onclick={() => goto('/user/' + $page.data.session?.user?.id)}
				aria-label="Profile"
				class="flex flex-col items-center justify-center gap-1 flex-1 py-3 relative transition-colors"
				style={isProfile ? 'color: oklch(0.97 0 0);' : 'color: oklch(0.42 0 0);'}
			>
				{#if isProfile}
					<div
						class="absolute top-0 left-1/2 -translate-x-1/2 w-8 rounded-b-sm"
						style="height: 2px; background: var(--gradient-brand-horizontal);"
					></div>
				{/if}
				<i class="fa-solid fa-user text-base"></i>
				<span class="text-[10px] font-semibold tracking-widest uppercase">Profile</span>
			</button>
		</div>
	</nav>
{/if}

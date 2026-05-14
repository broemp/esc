<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: path = $page.url.pathname;
	$: isHome = path === '/';
	$: isVote = path.startsWith('/vote');
	$: isGroup = path.startsWith('/group');
	$: isProfile = path.startsWith('/user');
</script>

{#if !$page.data.session}
	<div class="hidden md:block text-center text-sm py-2" style="color: oklch(0.73 0.16 82 / 0.6);">
		Designed for mobile — desktop may have layout differences.
	</div>
{:else}
	<nav class="fixed bottom-3 z-50 w-full flex justify-center px-4">
		<div
			class="flex items-center gap-1 px-2 py-2 rounded-2xl border"
			style="background: oklch(0.09 0 0 / 0.92); border-color: oklch(0.22 0.04 82 / 0.35); backdrop-filter: blur(12px);"
		>
			<button
				onclick={() => goto('/')}
				class="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors"
				style={isHome ? 'color: #D4AF37;' : 'color: oklch(0.60 0 0);'}
				aria-label="Home"
			>
				<i class="fa-solid fa-house text-lg"></i>
				<span class="text-[10px] font-semibold tracking-wide">Home</span>
			</button>

			<button
				onclick={() => goto('/vote')}
				class="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors"
				style={isVote ? 'color: #D4AF37;' : 'color: oklch(0.60 0 0);'}
				aria-label="Vote"
			>
				<i class="fa-solid fa-check-to-slot text-lg"></i>
				<span class="text-[10px] font-semibold tracking-wide">Vote</span>
			</button>

			<button
				onclick={() => goto('/group')}
				class="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors"
				style={isGroup ? 'color: #D4AF37;' : 'color: oklch(0.60 0 0);'}
				aria-label="Groups"
			>
				<i class="fa-solid fa-user-group text-lg"></i>
				<span class="text-[10px] font-semibold tracking-wide">Groups</span>
			</button>

			<button
				onclick={() => goto('/user/' + $page.data.session?.user?.id)}
				class="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors"
				style={isProfile ? 'color: #D4AF37;' : 'color: oklch(0.60 0 0);'}
				aria-label="Profile"
			>
				<i class="fa-solid fa-user text-lg"></i>
				<span class="text-[10px] font-semibold tracking-wide">Profile</span>
			</button>
		</div>
	</nav>
{/if}

<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>

{#if !$page.data.session}
<div class="hidden md:block text-center text-xl text-red-500">
	PLEASE NOTE THAT THIS WEBSITE IS DESIGNED FOR MOBILE-USE IN MIND. DESKTOP USERS MIGHT
	EXPERIENCE GRAPHICAL ISSUES.
</div>
{:else}
<div class="flex justify-center fixed bottom-2 z-50 w-full">
	<div class="btn-group variant-filled">
		<button on:click={() => goto('/')} class="w-1/4">
			<div class=""><i class="fa-solid fa-house"></i></div>
		</button>
		<button on:click={() => goto('/vote')}>
			<i class="fa-solid fa-check-to-slot"></i>
		</button>
		<button on:click={() => goto('/group')}>
			<i class="fa-solid fa-user-group"></i>
		</button>
		<button on:click={() => goto('/profile')}>
			<i class="fa-solid fa-user"></i>
		</button>
	</div>
</div>

{/if}
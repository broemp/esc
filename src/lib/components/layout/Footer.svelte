<script>
	import { goto } from '$app/navigation';
</script>

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
		<button on:click={() => goto('/settings')}>
			<i class="fa-solid fa-gear"></i>
		</button>
	</div>
</div>

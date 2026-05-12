<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	const callbackUrl = $page.url.searchParams.get('callbackUrl') ?? '/';
</script>

<div class="flex items-center justify-center h-screen">
	<div class="card p-4 w-72 h-64 preset-tonal-primary m-auto">
		<header class="card-header flex justify-center">
			<span class="text-4xl font-bold">Login</span>
		</header>
		<section class="p-4">
			<hr class="p-4" />
			<div class="grid grid-cols-1 space-y-3 items-center">
				<button onclick={() => signIn('discord', { callbackUrl })} class="btn preset-filled">
					<i class="fa-brands fa-discord pr-4"></i> Discord
				</button>
				<button onclick={() => signIn('google', { callbackUrl })} class="btn preset-filled">
					<i class="fa-brands fa-google pr-4"></i> Google
				</button>
			</div>
		</section>
	</div>
</div>

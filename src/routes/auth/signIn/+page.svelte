<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	const callbackUrl = $page.url.searchParams.get('callbackUrl');

	const handleSignIn = (provider: string) => {
		signIn(provider, { callbackUrl: callbackUrl ? callbackUrl : '/' });
	};
</script>

<div class="h-full flex items-center justify-center">
	<div class="card p-4 w-72 h-96 bg-gradient-to-br variant-gradient-primary-secondary">
		<header class="card-header flex justify-center">
			<span class="text-4xl font-bold"> Login </span>
		</header>
		<section class="card-body p-4 align-middle">
			<hr class="p-4" />
			<div class="grid grid-cols-1 space-y-3 items-center">
				<button on:click={() => handleSignIn('discord')} class="btn variant-filled">
					<i class="fa-brands fa-discord pr-4"></i> Discord
				</button>
				<button on:click={() => handleSignIn('reddit')} class="btn variant-filled">
					<i class="fa-brands fa-reddit pr-4"></i> Reddit
				</button>
				<button on:click={() => handleSignIn('google')} class="btn variant-filled">
					<i class="fa-brands fa-google pr-4"></i> Google
				</button>
			</div>
		</section>
	</div>
</div>

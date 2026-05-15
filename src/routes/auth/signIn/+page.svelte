<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	const callbackUrl = $page.url.searchParams.get('callbackUrl') ?? '/';

	let passkeyEmail = $state('');
	let passkeyError = $state('');
	let passkeyLoading = $state(false);
	let showRegister = $state(false);

	async function handlePasskey(action: 'authenticate' | 'register') {
		passkeyError = '';
		passkeyLoading = true;
		try {
			const { startAuthentication, startRegistration } = await import('@simplewebauthn/browser');

			const params = new URLSearchParams({ action, callbackUrl });
			if (action === 'register' && passkeyEmail) params.set('email', passkeyEmail);

			const optionsResp = await fetch(`/auth/webauthn-options/passkey?${params}`);
			if (!optionsResp.ok) {
				passkeyError = 'Could not get passkey options. Try again.';
				return;
			}

			const optionsData = await optionsResp.json();
			let webAuthnResponse;

			if (optionsData.action === 'authenticate') {
				webAuthnResponse = await startAuthentication(optionsData.options);
			} else {
				webAuthnResponse = await startRegistration(optionsData.options);
			}

			const res = await fetch(`/auth/callback/passkey`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: new URLSearchParams({
					data: JSON.stringify(webAuthnResponse),
					action: optionsData.action,
					callbackUrl
				})
			});

			const data = await res.json();
			if (data.url) {
				const url = new URL(data.url);
				const error = url.searchParams.get('error');
				if (error) {
					passkeyError = 'Passkey sign-in failed. Please try again.';
				} else {
					window.location.href = data.url;
				}
			}
		} catch (err: unknown) {
			if (err instanceof Error && err.name === 'NotAllowedError') {
				passkeyError = 'Passkey cancelled or not available on this device.';
			} else {
				passkeyError = 'Something went wrong. Please try again.';
			}
		} finally {
			passkeyLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-[88vh] px-4">
	<div class="w-full max-w-sm">
		<div class="card-esc p-8 relative overflow-hidden">
			<div class="absolute top-0 left-0 right-0 h-0.5" style="background: var(--gradient-brand-horizontal);"></div>

			<div class="text-center mb-8">
				<h1 class="text-gradient text-4xl font-bold tracking-tight leading-none mb-2">ESC 2026</h1>
				<p class="text-sm" style="color: oklch(0.50 0 0);">Sign in to join the watch party</p>
			</div>

			<div class="space-y-3">
				<button
					onclick={() => signIn('discord', { callbackUrl })}
					class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all"
					style="background: oklch(0.09 0 0); border: 1px solid oklch(0.22 0 0 / 0.7); color: oklch(0.92 0 0);"
					onmouseenter={(e) => (e.currentTarget.style.borderColor = 'oklch(0.35 0 0)')}
					onmouseleave={(e) => (e.currentTarget.style.borderColor = 'oklch(0.22 0 0 / 0.7)')}
				>
					<i class="fa-brands fa-discord text-[#5865F2] text-xl"></i>
					Continue with Discord
				</button>

				<button
					onclick={() => signIn('google', { callbackUrl })}
					class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all"
					style="background: oklch(0.09 0 0); border: 1px solid oklch(0.22 0 0 / 0.7); color: oklch(0.92 0 0);"
					onmouseenter={(e) => (e.currentTarget.style.borderColor = 'oklch(0.35 0 0)')}
					onmouseleave={(e) => (e.currentTarget.style.borderColor = 'oklch(0.22 0 0 / 0.7)')}
				>
					<i class="fa-brands fa-google text-xl" style="color: #EA4335;"></i>
					Continue with Google
				</button>

				<div class="flex items-center gap-3 my-1">
					<div class="flex-1 h-px" style="background: oklch(0.20 0 0);"></div>
					<span class="text-xs" style="color: oklch(0.40 0 0);">or</span>
					<div class="flex-1 h-px" style="background: oklch(0.20 0 0);"></div>
				</div>

				<button
					onclick={() => handlePasskey('authenticate')}
					disabled={passkeyLoading}
					class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					style="background: oklch(0.09 0 0); border: 1px solid oklch(0.22 0 0 / 0.7); color: oklch(0.92 0 0);"
					onmouseenter={(e) => { if (!passkeyLoading) e.currentTarget.style.borderColor = 'oklch(0.35 0 0)' }}
					onmouseleave={(e) => (e.currentTarget.style.borderColor = 'oklch(0.22 0 0 / 0.7)')}
				>
					{#if passkeyLoading && !showRegister}
						<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
					{:else}
						<i class="fa-solid fa-fingerprint text-xl" style="color: oklch(0.70 0.10 280);"></i>
					{/if}
					Sign in with Passkey
				</button>

				{#if passkeyError}
					<p class="text-xs text-center" style="color: oklch(0.65 0.18 25);">{passkeyError}</p>
				{/if}

				<button
					onclick={() => { showRegister = !showRegister; passkeyError = ''; }}
					class="w-full text-xs text-center py-1 transition-colors"
					style="color: oklch(0.40 0 0);"
					onmouseenter={(e) => (e.currentTarget.style.color = 'oklch(0.60 0 0)')}
					onmouseleave={(e) => (e.currentTarget.style.color = 'oklch(0.40 0 0)')}
				>
					{showRegister ? '↑ Cancel registration' : 'No account yet? Create one with a Passkey →'}
				</button>

				{#if showRegister}
					<div class="space-y-2 pt-1">
						<input
							type="email"
							bind:value={passkeyEmail}
							placeholder="your@email.com"
							class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
							style="background: oklch(0.09 0 0); border: 1px solid oklch(0.22 0 0 / 0.7); color: oklch(0.92 0 0);"
							onfocus={(e) => (e.currentTarget.style.borderColor = 'oklch(0.45 0.15 280)')}
							onblur={(e) => (e.currentTarget.style.borderColor = 'oklch(0.22 0 0 / 0.7)')}
						/>
						<p class="text-xs px-1" style="color: oklch(0.38 0 0);">
							We don't send emails — this is only used to identify your account. A fake address works fine.
						</p>
						<button
							onclick={() => handlePasskey('register')}
							disabled={passkeyLoading || !passkeyEmail}
							class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							style="background: oklch(0.30 0.10 280 / 0.4); border: 1px solid oklch(0.40 0.12 280 / 0.6); color: oklch(0.85 0.08 280);"
						>
							{#if passkeyLoading && showRegister}
								<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
								</svg>
							{/if}
							Create account with Passkey
						</button>
					</div>
				{/if}
			</div>

			<p class="text-center text-xs mt-6" style="color: oklch(0.35 0 0);">
				Eurovision 2026 · Vienna · 70th Anniversary
			</p>
		</div>
	</div>
</div>

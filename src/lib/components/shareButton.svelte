<script lang="ts">
	import { env } from '$env/dynamic/public';

	let {
		text = 'Check out this page!',
		url = env.PUBLIC_APP_URL,
		design = 'btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold',
		title = url.split('/').splice(-1)[0],
		children
	} = $props();

	let complete = $state(false);

	async function handleClick() {
		try {
			if (navigator.share) {
				try {
					await navigator.share({ title, text, url });
					return;
				} catch {
					// fall through to clipboard
				}
			}
			await navigator.clipboard.writeText(url);
			complete = true;
			setTimeout(() => (complete = false), 2000);
		} catch {
			try {
				await navigator.clipboard.writeText(url);
				complete = true;
				setTimeout(() => (complete = false), 2000);
			} catch {
				// ignore
			}
		}
	}
</script>

<button onclick={handleClick} class={design}>
	{#if complete}
		<i class="fa-solid fa-check mr-2"></i>Copied!
	{:else}
		{@render children?.()}
	{/if}
</button>

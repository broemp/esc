<script>
	import { env } from '$env/dynamic/public';
	export let text = 'Check out this page!';
	export let url = env.PUBLIC_APP_URL;
	export let design = 'btn';
	export let title = url.split('/').splice(-1)[0]; // default to end of url

	let complete = false;

	async function handleClick() {
		try {
			const shareData = {
				title: title,
				text: text,
				url: url
			};

			// Check if Web Share API is available and can share the data
			if (navigator.share && navigator.canShare(shareData)) {
				await navigator.share(shareData);
			} else {
				// Fallback to clipboard
				await navigator.clipboard.writeText(url);
				complete = true;
				// Reset the complete state after 2 seconds
				setTimeout(() => complete = false, 2000);
			}
		} catch (error) {
			console.error('Error sharing:', error);
			// If share fails, fallback to clipboard
			try {
				await navigator.clipboard.writeText(url);
				complete = true;
				setTimeout(() => complete = false, 2000);
			} catch (clipboardError) {
				console.error('Error copying to clipboard:', clipboardError);
			}
		}
	}
</script>

<button on:click={handleClick} class={design}>
	{#if complete}
		<slot name="complete">Copied!</slot>
	{:else}
		<slot>Share</slot>
	{/if}
</button>

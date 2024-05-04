<script>
	import { env } from '$env/dynamic/public';
	export let text = 'Check out this page!';
	export let url = env.PUBLIC_APP_URL;
	export let design = 'btn';
	export let title = url.split('/').splice(-1)[0]; // default to end of url

	let complete = false;

	async function handleClick() {
		try {
			let can = false;
			try {
				can = navigator.canShare();
			} catch {
				can = false;
			}
			if (can) {
				await navigator.share({ text, url, title });
			} else {
				await navigator.clipboard.writeText(url);
				complete = true;
			}
		} catch (error) {
			console.error(error);
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

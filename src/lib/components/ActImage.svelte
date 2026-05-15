<script lang="ts">
	let {
		src,
		alt = '',
		class: className = '',
		style = ''
	}: {
		src?: string | null;
		alt?: string;
		class?: string;
		style?: string;
	} = $props();

	let failed = $state(!src);
</script>

{#if !failed}
	<img
		{src}
		{alt}
		class={className}
		{style}
		onerror={() => (failed = true)}
		loading="lazy"
	/>
{:else}
	<div
		class="{className} flex items-center justify-center"
		{style}
		aria-label={alt}
		role="img"
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style="width: 40%; height: 40%; opacity: 0.25;"
		>
			<path
				d="M9 18V5l12-2v13"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5" />
			<circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5" />
		</svg>
	</div>
{/if}

<script lang="ts">
	const basePath = '/logo_esc25.png';
	const sizes = [300, 600, 900];
	const srcset = sizes.map((s) => `${basePath}?w=${s}&format=webp&quality=80 ${s}w`).join(', ');

	let { ...rest } = $props();
</script>

<img
	src={basePath}
	{srcset}
	sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px"
	alt="ESC Logo"
	width="150"
	loading="eager"
	{...rest}
/>

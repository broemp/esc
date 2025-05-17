<script lang="ts">
	// Generate different sizes for the background
	const sizes = [640, 1280, 1920, 2560];
	
	// Create srcset string
	const srcset = sizes
		.map(
			(size) =>
				`/bg-2025.png?w=${size}&format=webp&quality=80 ${size}w`
		)
		.join(', ');
</script>

<div class="fixed inset-0 -z-10">
	<picture>
		<source srcset={srcset} type="image/webp" />
		<img
			src="/bg-2025.png"
			alt=""
			class="w-full h-full object-cover object-center"
			loading="eager"
			decoding="async"
		/>
	</picture>
</div> 
<script lang="ts">
	import { browser } from '$app/environment';
	
	// Use direct path instead of URL constructor
	const basePath = '/logo_esc25.png';
	
	// Generate different sizes
	const sizes = [300, 600, 900];
	
	// Create srcset string
	const srcset = sizes
		.map(
			(size) =>
				`${basePath}?w=${size}&format=webp&quality=80 ${size}w`
		)
		.join(', ');
</script>

<img
	src={basePath}
	srcset={srcset}
	sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px"
	alt="ESC Logo"
	width="150"
	loading="eager"
	{...$$restProps}
/> 
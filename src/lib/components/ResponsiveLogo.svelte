<script lang="ts">
	import { browser } from '$app/environment';
	
	// Import the original logo
	const logo = new URL('/logo_esc25.png', import.meta.url);
	
	// Generate different sizes
	const sizes = [300, 600, 900];
	
	// Create srcset string
	const srcset = sizes
		.map(
			(size) =>
				`${logo.href}?w=${size}&format=webp&quality=80 ${size}w`
		)
		.join(', ');
</script>

<img
	src={logo.href}
	srcset={srcset}
	sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px"
	alt="ESC Logo"
	width="150"
	loading="eager"
	{...$$restProps}
/> 
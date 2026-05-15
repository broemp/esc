<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';

	const borderMap: Record<string, string> = {
		success: 'oklch(0.65 0.25 145)',
		error:   'oklch(0.62 0.28 0)',
		warning: 'oklch(0.75 0.22 75)',
		info:    'oklch(0.55 0.18 250)'
	};
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg text-sm"
			style="
				background: oklch(0.11 0 0);
				border: 1px solid oklch(0.20 0 0 / 0.6);
				border-left: 3px solid {borderMap[toast.type] ?? borderMap.info};
				color: oklch(0.92 0 0);
				box-shadow: 0 4px 24px oklch(0 0 0 / 0.5);
			"
		>
			<span class="flex-1 leading-snug">{@html toast.message}</span>
			<button
				onclick={() => toastStore.dismiss(toast.id)}
				class="shrink-0 mt-0.5 transition-opacity text-xs"
				style="color: oklch(0.50 0 0);"
				onmouseenter={(e) => (e.currentTarget.style.color = 'oklch(0.90 0 0)')}
				onmouseleave={(e) => (e.currentTarget.style.color = 'oklch(0.50 0 0)')}
				aria-label="Dismiss"
			>✕</button>
		</div>
	{/each}
</div>

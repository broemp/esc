<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';

	const colorMap = {
		success: 'preset-filled-success-500',
		error: 'preset-filled-error-500',
		warning: 'preset-filled-warning-500',
		info: 'preset-tonal-surface'
	};
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="px-4 py-3 rounded shadow-lg text-sm flex justify-between items-center gap-4 {colorMap[toast.type]}"
		>
			<span>{toast.message}</span>
			<button onclick={() => toastStore.dismiss(toast.id)} class="shrink-0 opacity-70 hover:opacity-100">✕</button>
		</div>
	{/each}
</div>

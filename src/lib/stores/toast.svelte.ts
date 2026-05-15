import { untrack } from 'svelte';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
	timeout: number;
}

function createToastStore() {
	let toasts = $state<ToastMessage[]>([]);
	const timers = new Map<string, ReturnType<typeof setTimeout>>();

	function trigger(message: string, type: ToastType = 'info', timeout = 2000) {
		const id = crypto.randomUUID();
		const current = untrack(() => toasts);
		toasts = [...current, { id, message, type, timeout }];
		timers.set(id, setTimeout(() => dismiss(id), timeout));
	}

	function dismiss(id: string) {
		clearTimeout(timers.get(id));
		timers.delete(id);
		toasts = toasts.filter((t) => t.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		trigger,
		dismiss
	};
}

export const toastStore = createToastStore();

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
	timeout: number;
}

function createToastStore() {
	let toasts = $state<ToastMessage[]>([]);

	function trigger(message: string, type: ToastType = 'info', timeout = 2000) {
		const id = crypto.randomUUID();
		toasts = [...toasts, { id, message, type, timeout }];
		setTimeout(() => dismiss(id), timeout);
	}

	function dismiss(id: string) {
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

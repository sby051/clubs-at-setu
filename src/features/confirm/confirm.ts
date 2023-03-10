import { writable } from "svelte/store";
import type { ConfirmButtons, ConfirmData, ConfirmOptions } from "./types";

const DEFAULT_CONFIRM_BUTTONS: ConfirmButtons = {
	confirm: {
		text: "Confirm",
		style: "primary",
		icon: "check",
	},
	cancel: {
		text: "Cancel",
		style: "outlined:danger",
	},
};

let _confirm_promise: Promise<boolean>;
let _resolve_confirm: (value: boolean) => void;

export const confirmData = writable<ConfirmData | null>(null);

export const submitConfirm = (value: boolean): void => {
	confirmData.set(null);
	_resolve_confirm(value);
};

export const confirm = (title: string, options?: ConfirmOptions): Promise<boolean> => {
	confirmData.set({
		title,
		message: options?.message,
		icon: options?.icon,
		buttons: options?.buttons ?? DEFAULT_CONFIRM_BUTTONS,
		confirmationInput: options?.confirmationInput,
	});

	_confirm_promise = new Promise<boolean>((resolve) => {
		_resolve_confirm = resolve;
	});

	return _confirm_promise;
};

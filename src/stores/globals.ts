import { writable } from "svelte/store";

export const windowTitle = writable<string | null>(null);

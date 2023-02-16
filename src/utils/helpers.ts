import type { SvelteComponent } from "svelte";

export const lazyLoadComponent = async (path: string): Promise<SvelteComponent> => (await import(path)).default;
export const toHTMLEntities = (str: string) => str.replace(/\p{Emoji}/gmu, (s) => "&#" + s.codePointAt(0) + ";");

export const whenInBrowser = (fn: () => unknown): void => {
	if (typeof window !== "undefined") fn();
};

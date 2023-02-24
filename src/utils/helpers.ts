import type { SvelteComponent } from "svelte";

export const lazyLoadComponent = async (path: string): Promise<SvelteComponent> => (await import(path)).default;
export const toHTMLEntities = (str: string) => str.replace(/\p{Emoji}/gmu, (s) => "&#" + s.codePointAt(0) + ";");

export const whenInBrowser = (fn: () => unknown): void => {
	if (typeof window !== "undefined") fn();
};

export const safeAwait = async <T>(promise: Promise<T>): Promise<[T | null, Error | null]> => {
	try {
		const data = await promise;
		return [data, null];
	} catch (error: unknown) {
		return [null, error];
	}
}


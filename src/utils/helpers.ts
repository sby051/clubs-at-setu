import type { SvelteComponent } from "svelte";

export const lazyLoadComponent = async (path: string): Promise<SvelteComponent> => (await import(path)).default;

export const whenInBrowser = (fn: () => unknown): void => {
	if (typeof window !== "undefined") fn();
};

/**
 * Await a promise and return a tuple of [data, error]
 * @param p Promise to await
 * @returns [data, error] tuple
 */
export async function safeAwait<T>(p: Promise<T>): Promise<[T | null, unknown | null]> {
	try {
		const d = await p;
		return [d, null];
	} catch (e: unknown) {
		return [null, e];
	}
}

export const sleep = (seconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
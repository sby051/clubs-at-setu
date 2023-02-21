import { updateDocuments } from "@fb/fsdb";
import type { FirestoreCollection } from "@fb/types";
import type { Club } from "@types";
import { writable } from "svelte/store";

export const clubs = writable<FirestoreCollection<Club>>({});

clubs.subscribe(async (cache) => {
	await updateDocuments("clubs", Object.keys(cache), { cache });
});

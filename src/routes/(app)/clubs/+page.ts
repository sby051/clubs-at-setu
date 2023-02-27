import { getCollection } from "@fb/fsdb";
import type { Club } from "@types";
import type { PageLoad } from "./$types";

export const load = (async () => {
	const clubs = await getCollection<Club>("clubs");
	return { clubs };
}) satisfies PageLoad;

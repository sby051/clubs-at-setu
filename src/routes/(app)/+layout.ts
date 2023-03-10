import { getCollection } from "@fb/firestore";
import type { Club } from "@types";
import type { LayoutLoad } from "./$types";

export const load = (async () => {
	const clubs = await getCollection<Club>("clubs");
	return { clubs };
}) satisfies LayoutLoad;

import type { LayoutLoad } from "./$types";
import { getCollection } from "@fb/fsdb";
import type { Club } from "@types";

export const load = (async () => {
    const clubs = await getCollection<Club>("clubs");
    return { clubs }
}) satisfies LayoutLoad;
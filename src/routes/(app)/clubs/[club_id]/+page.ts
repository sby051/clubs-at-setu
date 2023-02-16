import { getDocument } from "@fb/fsdb";
import type { PageLoad } from "./$types";
import type { Club } from "@types";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
    const { club_id } = params;
    const club = await getDocument<Club>("clubs", club_id);
    if(!club) throw error(404, "Club not found");
    return { club };
}) satisfies PageLoad;
import { getDocument } from "@fb/fsdb";
import type { PageLoad } from "./$types";
import type { Club } from "@types";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, parent }) => {
    const { club_id } = params;
    
    let club: Club;

    const { clubs } = await parent();

    if (club_id in clubs) club = clubs[club_id];
    else club = await getDocument<Club>("clubs", club_id);

    if(!club) throw error(404, "Club not found");
    return { club };
}) satisfies PageLoad;
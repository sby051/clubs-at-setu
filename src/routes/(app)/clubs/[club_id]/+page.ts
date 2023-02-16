import { getDocument } from "@fb/fsdb";
import type { PageLoad } from "./$types";
import type { Club } from "@types";
import { error } from "@sveltejs/kit";

export const load = (async ({ parent, params }) => {
    const { club_id } = params;

    // we want to fetch the club from the parent "clubs" array of obj if it exists
    // otherwise we want to fetch it from the server
    if(!parent.clubs) {
        const club = await getDocument<Club>("clubs", club_id);
        if(!club) throw error(404, "Club not found");
        return { club };
    }

    const club = parent.clubs.find(club => club.id === club_id);

    if(!club) throw error(404, "Club not found");
}) satisfies PageLoad;
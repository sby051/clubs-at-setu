import { getDocument } from "@fb/fsdb";
import { error } from "@sveltejs/kit";
import type { Club } from "@types";
import type { PageLoad } from "./$types";

export const load = (async ({ params, parent }) => {
	const { club_id } = params;
	if(!club_id) throw error(401, "No club id provided");
	const club = await getDocument<Club>("clubs", club_id);
	if (!club) throw error(404, "Club not found");
	return { club };
}) satisfies PageLoad;

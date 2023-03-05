import { getDocument } from "@fb/firestore";
import { error } from "@sveltejs/kit";
import type { Club } from "@types";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
	const { id } = params;
	if (!id) throw error(401, "No club id provided");
	const club = await getDocument<Club>("clubs", id);
	if (!club) throw error(404, "Club not found");
	return { club };
}) satisfies PageLoad;

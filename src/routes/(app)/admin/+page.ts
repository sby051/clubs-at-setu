import { getCollection } from "@fb/fsdb";
import type { PageLoad } from "./$types";
import type { Club, User } from "@types";

export const load = (async () => {
    const users = getCollection<User>("users");
    const clubs = getCollection<Club>("clubs");
    return { users, clubs };
}) satisfies PageLoad;
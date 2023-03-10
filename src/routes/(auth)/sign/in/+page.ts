import type { PageLoad } from "./$types";

export const load = (async ({ url }) => {
	return {
		email: url.searchParams.has("email") ? url.searchParams.get("email") : "",
		password: "",
	};
}) satisfies PageLoad;

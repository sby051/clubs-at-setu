import { auth } from "@fb";
import { getDocument, updateDocument } from "@fb/fsdb";
import type { User } from "@types";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";

export const user = writable<User | null>(null);
export const authed = writable<boolean | null>(null);

onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
	if (firebaseUser === null) {
		authed.set(false);
		user.set(null);
		return;
	}
	
	const userDoc = await getDocument<User>("users", firebaseUser.uid);

	if (!userDoc) {
		authed.set(false);
		user.set(null);
		return;
	}

	user.set(userDoc);
	authed.set(true);
});

user.subscribe(async (u) => {
	if (!u) return;
	await updateDocument("users", u.id, u);
});

export default user;

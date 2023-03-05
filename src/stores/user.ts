import { auth } from "@fb";
import { getDocument, updateDocument } from "@fb/firestore";
import type { User } from "@types";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";

const BLANK_USER = {} as User;

export const user = writable<User>(BLANK_USER);
export const authed = writable<boolean | null>(null);

onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
	if (firebaseUser === null) {
		authed.set(false);
		user.set(BLANK_USER);
		return;
	}

	const userDoc = await getDocument<User>("users", firebaseUser.uid);

	if (!userDoc) {
		authed.set(false);
		user.set(BLANK_USER);
		return;
	}

	user.set(userDoc);
	authed.set(true);
});

user.subscribe(async (u) => {
	if (JSON.stringify(u) === JSON.stringify(BLANK_USER)) return;
	await updateDocument("users", u.id, u);
});

export default user;

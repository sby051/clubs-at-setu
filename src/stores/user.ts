import { auth } from "@fb";
import { getDocument, getDocuments, updateDocument } from "@fb/fsdb";
import { getFileURL } from "@fb/storage";
import { UserSchema, type User } from "@types";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";

export const user = writable<User | null>(null);
export const authed = writable<boolean | null>(null);

onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
	if (!firebaseUser) {
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

	if (!UserSchema.safeParse(userDoc).success) {
		authed.set(false);
		user.set(null);
		alert("Your account is corrupted. Please contact an administrator.");
		return;
	}

	const clubDocs = await getDocuments<Club>("clubs", userDoc.clubs);
	userDoc.photo = await getFileURL(userDoc.photo);
	userDoc.clubs = clubDocs;
	user.set(userDoc);
	authed.set(true);
});

user.subscribe(async (u) => {
	if (!u) return;
	await updateDocument("users", u.id, u);
});

export default user;

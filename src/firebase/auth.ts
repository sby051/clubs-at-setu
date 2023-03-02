import type { User } from "@types";
import type { UserCredential } from "firebase/auth";
import {
	createUserWithEmailAndPassword,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signOut as signOutAuth,
	updatePassword,
} from "firebase/auth";
import { auth } from ".";
import { createDocument, deleteDocument, getCollection, getDocument } from "./fsdb";
import { getFileURL } from "./storage";

export const signUp = async (user: User): Promise<boolean> => {
	let userCredential: UserCredential;
	try {
		userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password as string);
	} catch (err) {
		console.log(err);
		return false;
	}

	if (!userCredential) return false;

	delete user.password;
	user.id = userCredential.user.uid;

	const created = await createDocument("users", user.id, user);

	if (!created) return false;

	return true;
};

export const signOut = async (): Promise<void> => await signOutAuth(auth);

export const signIn = async (email: string, password: string): Promise<boolean> => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return true;
	} catch (err) {
		return false;
	}
};

export const requestUserData = async (id: string) => {
	const userDoc = await getDocument<User>("users", id);
	const userFiles = await getFileURL(userDoc?.photo)

	return {
		fsdb: userDoc,
		storage: userFiles
	}
};

export const deleteAccount = async (): Promise<boolean> => {
	if (!(await deleteDocument("users", auth.currentUser?.uid))) return false;
	if (!(await auth.currentUser?.delete())) return false;
	return true;
};

export const isEmailUsed = async (email: string): Promise<boolean> => {
	const users = await getCollection<User>("users");
	return Object.values(users).some((user) => user.email === email);
};

export const changePassword = async (password: string): Promise<boolean> => {
	try {
		await updatePassword(auth.currentUser, password);
		return true;
	} catch (err) {
		return false;
	}
};

export const reauthenticate = async (password: string): Promise<boolean> => {
	try {
		await reauthenticateWithCredential(auth.currentUser, password);
		return true;
	} catch (err) {
		return false;
	}
};

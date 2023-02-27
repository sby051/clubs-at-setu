import type { User } from "@types";
import type { UserCredential } from "firebase/auth";
import {
	createUserWithEmailAndPassword,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
} from "firebase/auth";
import { auth } from ".";
import { createDocument, deleteDocument, getCollection } from "./fsdb";

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

export const logout = async (): Promise<void> => await signOut(auth);

export const login = async (email: string, password: string): Promise<boolean> => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return true;
	} catch (err) {
		return false;
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

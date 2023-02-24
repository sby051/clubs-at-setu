import type { User } from "@types";
import {
	createUserWithEmailAndPassword,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
} from "firebase/auth";
import { auth } from ".";
import { createDocument, deleteDocument, getCollection } from "./fsdb";
import { safeAwait } from "@utils/helpers";

export const signUp = async (user: User): Promise<boolean> => {
	const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);

	const { uid } = userCredential.user;

	if (!uid) return false;

	delete user.password;
	user.id = uid;

	if (!(await createDocument("users", uid, user))) return false;

	return true;
};

export const logout = async (): Promise<void> => await signOut(auth);

export const login = async (email: string, password: string): Promise<boolean> => {
	const [_, err] = await safeAwait(signInWithEmailAndPassword(auth, email, password));
	return !err;
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
	const [_, err] = await safeAwait(updatePassword(auth.currentUser, password));
	return !err;
};

export const reauthenticate = async (password: string): Promise<boolean> => {
	const [_, err] = await safeAwait(reauthenticateWithCredential(auth.currentUser, password));
	return !err;
};

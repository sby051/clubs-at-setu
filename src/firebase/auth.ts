import { UserSchema, type User } from "@types";
import { safeAwait } from "@utils/helpers";
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
	if (!UserSchema.safeParse(user).success) return false;

	const [userCredential, err] = await safeAwait(createUserWithEmailAndPassword(auth, user.email, user.password));

	if (err) return false;

	if (!userCredential?.uid) return false;

	delete user.password;
	user.id = userCredential?.uid;

	if (!(await createDocument("users", userCredential?.uid, user))) return false;

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

import type { ID } from "@types";
import { collection as cltn, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from ".";

export type FirestoreCollection<T> = { [key: ID]: T };
export type FirestoreDocument<T> = T & { id: ID };

export const getDocument = async <ExpectedDocument>(collection: string, docId: ID) => {
	const docSnapshot = await getDoc(doc(firestore, collection, docId));
	return docSnapshot.exists() ? (docSnapshot.data() as FirestoreDocument<ExpectedDocument>) : null;
};

export const getDocuments = async <ExpectedDocument>(collection: string, docIds: ID[]) => {
	const querySnapshot = await getDocs(cltn(firestore, collection));
	return querySnapshot.docs
		.filter((doc) => docIds.includes(doc.id))
		.map((doc) => doc.data() as FirestoreDocument<ExpectedDocument>);
};

export const getCollection = async <ExpectedDocument>(collection: string) => {
	const querySnapshot = await getDocs(cltn(firestore, collection));
	return querySnapshot.docs.reduce((acc, doc) => {
		acc[doc.id] = doc.data() as ExpectedDocument;
		return acc;
	}, {} as FirestoreCollection<ExpectedDocument>);
};

export const createDocument = async (collection: string, docId: ID, data: unknown): Promise<boolean> => {
	if (await documentExists(collection, docId)) return false;
	try {
		await setDoc(doc(firestore, collection, docId), data);
		return true;
	} catch (e) {
		return false;
	}
};

export const createDocuments = async (collection: string, data: unknown[]): Promise<boolean> => {
	try {
		data.forEach(async (obj) => {
			await createDocument(collection, obj.id, obj);
		});
		return true;
	} catch (e) {
		return false;
	}
};

export const updateDocument = async (collection: string, docId: ID, data: Partial<unknown>): Promise<boolean> => {
	if (!(await documentExists(collection, docId))) return false;
	try {
		await updateDoc(doc(firestore, collection, docId), data);
		return true;
	} catch (e) {
		return false;
	}
};

export const updateDocuments = async (collection: string, docIds: ID[], data: Partial<unknown>): Promise<boolean> => {
	try {
		docIds.forEach((docId) => updateDoc(doc(firestore, collection, docId), data));
		return true;
	} catch (e) {
		return false;
	}
};

export const deleteDocument = async (collection: string, docId: ID): Promise<boolean> => {
	if (!(await documentExists(collection, docId))) return false;
	try {
		await deleteDoc(doc(firestore, collection, docId));
		return true;
	} catch (e) {
		return false;
	}
};

export const deleteDocuments = async (collection: string, docIds: ID[]): Promise<boolean> => {
	try {
		docIds.forEach((docId) => deleteDoc(doc(firestore, collection, docId)));
		return true;
	} catch (e) {
		return false;
	}
};

export const documentExists = async (collection: string, docId: ID): Promise<boolean> =>
	(await getDoc(doc(firestore, collection, docId))).exists();

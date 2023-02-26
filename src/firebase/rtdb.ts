import { off, onChildAdded, onChildRemoved, onValue, push, ref, remove } from "firebase/database";
import { rtdb } from ".";

export function subscribeToRealtimeDatabase(path: string) {
	const dbRef = ref(rtdb, path);
	const whenAdded = (callback: (snapshot: unknown) => void) => onChildAdded(dbRef, callback);
	const whenRemoved = (callback: (snapshot: unknown) => void) => onChildRemoved(dbRef, callback);
	const whenChanged = (callback: (snapshot: unknown) => void) => onValue(dbRef, callback);
	const clearDatabase = () => remove(dbRef);
	const pushData = (k: ID, v: unknown) => push(dbRef);
	const removeData = (k: ID) => remove(ref(dbRef, key));
	const close = () => off(dbRef);
	return { whenAdded, whenRemoved, whenChanged, pushData, removeData, clearDatabase, close } as const;
}

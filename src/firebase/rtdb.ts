import type { Unsubscribe } from "firebase/auth";
import {
	off,
	onChildAdded,
	onChildRemoved,
	onValue,
	push,
	ref,
	remove,
	update,
	type DataSnapshot,
} from "firebase/database";
import { rtdb } from ".";

type CallbackFunction = (snapshot: DataSnapshot) => Unsubscribe;

export const subscribeToRealtimeDatabase = (path: string) => {
	const reference = ref(rtdb, path);
	return {
		onAdded: (callback: CallbackFunction) => onChildAdded(reference, callback),
		onRemoved: (callback: CallbackFunction) => onChildRemoved(reference, callback),
		onChanged: (callback: CallbackFunction) => onValue(reference, callback),
		clear: () => remove(reference),
		add: (key: string | null, value: unknown) => push(ref(rtdb, `${path}/${key}`), value),
		update: (key: string | null, values: Record<string, unknown>) => update(ref(rtdb, `${path}/${key}`), values),
		delete: (key: string) => remove(ref(rtdb, `${path}/${key}`)),
		unsubscribe: () => off(reference),
	};
};

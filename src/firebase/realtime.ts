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
import { realtime } from ".";

type CallbackFunction = (snapshot: DataSnapshot) => Unsubscribe | Promise<Unsubscribe>;

export const subscribeToRealtimeDatabase = (path: string) => {
	const reference = ref(realtime, path);
	return {
		onAdd: (callback: CallbackFunction) => onChildAdded(reference, callback),
		onRemove: (callback: CallbackFunction) => onChildRemoved(reference, callback),
		onChange: (callback: CallbackFunction) => onValue(reference, callback),
		clear: () => remove(reference),
		add: (key: string | null, value: unknown) => push(ref(realtime, `${path}/${key}`), value),
		update: (key: string | null, values: Record<string, unknown>) => update(ref(realtime, `${path}/${key}`), values),
		delete: (key: string) => remove(ref(realtime, `${path}/${key}`)),
		unsubscribe: () => off(reference),
	} as const;
};
import { ref, onValue, onChildAdded, onChildRemoved, remove, off } from "firebase/database";
import { rtdb } from ".";

export interface RealtimeDatabaseSubscription {
    whenAdded: (callback: (snapshot: unknown) => void) => void;
    whenRemoved: (callback: (snapshot: unknown) => void) => void;
    whenChanged: (callback: (snapshot: unknown) => void) => void;
    clearDatabase: () => void;
    close: unknown;
}

export function subscribeToRealtimeDatabase(path: string): RealtimeDatabaseSubscription {
    const dbRef = ref(rtdb, path);
    const whenAdded = (callback: (snapshot: unknown) => void) => onChildAdded(dbRef, callback);
    const whenRemoved = (callback: (snapshot: unknown) => void) => onChildRemoved(dbRef, callback);
    const whenChanged = (callback: (snapshot: unknown) => void) => onValue(dbRef, callback);
    const clearDatabase = () => remove(dbRef);
    const close = () => off(dbRef);
    return { whenAdded, whenRemoved, whenChanged, clearDatabase, close };
}
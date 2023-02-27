import type { ID } from "@types";

export type FirestoreCollection<T> = { [key: ID]: T };
export type RealtimeDatabaseSubscription = {
    onAdded: (callback: (snapshot: unknown) => void) => void;
    onRemoved: (callback: (snapshot: unknown) => void) => void;
    onChanged: (callback: (snapshot: unknown) => void) => void;
    clear: () => void;
    add: (k: string, v: unknown) => void;
    update: (k: string, v: unknown) => void;
    remove: (k: string) => void;
    unsubscribe: () => void;
}

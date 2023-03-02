import type { ID } from "@types";
import type { subscribeToRealtimeDatabase } from "./rtdb";

export type FirestoreCollection<T> = { [key: ID]: T };
export type RealtimeDatabaseSubscription = ReturnType<typeof subscribeToRealtimeDatabase>;

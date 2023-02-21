import { writable } from 'svelte/store';
import { updateDocuments } from '@fb/fsdb';
import type { Club, ID } from '@types';
import type { FirestoreCollection } from '@fb/types';

export const clubs = writable<FirestoreCollection<Club>>({});

clubs.subscribe(async (cache) => {
    await updateDocuments('clubs', Object.keys(cache), { cache });
});
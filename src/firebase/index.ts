import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import FIREBASE_CONFIG from "./firebase.config.ts";

const _firebase_app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(_firebase_app);
export const firestore = getFirestore(_firebase_app);
export const realtime = getDatabase(_firebase_app);
export const storage = getStorage(_firebase_app);
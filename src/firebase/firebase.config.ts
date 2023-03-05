import * as env from "$env/static/public"; // TODO: Change to env private
import type { FirebaseOptions } from "firebase/app";

const FIREBASE_CONFIG: FirebaseOptions = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    databaseURL: env.FIREBASE_DATABASE_URL,
    appId: env.FIREBASE_APP_ID
};

export default FIREBASE_CONFIG;
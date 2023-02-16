// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	namespace App {
		interface PublicEnv {
			FIREBASE_API_KEY: string;
			FIREBASE_AUTH_DOMAIN: string;
			FIREBASE_PROJECT_ID: string;
			FIREBASE_STORAGE_BUCKET: string;
			FIREBASE_MESSAGING_SENDER_ID: string;
			FIREBASE_APP_ID: string;
		}
	}
}

export {};

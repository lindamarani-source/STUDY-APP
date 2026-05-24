import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
] as const;

export const firebaseConfigError = requiredConfigKeys.some(
  (key) => !firebaseConfig[key],
)
  ? 'Firebase is not configured yet. The app is running in local demo mode until you add VITE_FIREBASE_* values to a .env file and restart the dev server.'
  : null;

const app: FirebaseApp | null = firebaseConfigError
  ? null
  : initializeApp(firebaseConfig);

export const auth: Auth | null = app ? getAuth(app) : null;

export const db: Firestore | null = app ? getFirestore(app) : null;

export default app;

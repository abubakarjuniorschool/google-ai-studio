import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Support both configured project ID and database ID
export const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const databaseId = (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = databaseId && databaseId !== '(default)'
  ? initializeFirestore(app, {}, databaseId)
  : getFirestore(app);

export const auth = getAuth(app);

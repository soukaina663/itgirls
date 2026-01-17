import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// ✅ Ne pas crash si l'env est manquant (ex: tu utilises login backend)
const hasApiKey = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

export const app = hasApiKey
    ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
    : null;

export const auth = hasApiKey ? getAuth(app) : null;

if (!hasApiKey) {
    console.warn(
        "[Firebase] REACT_APP_FIREBASE_API_KEY manquante ou invalide. Firebase Auth désactivé."
    );
}

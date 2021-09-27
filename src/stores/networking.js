import firebase from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID,
} = import.meta.env;

const app = firebase.initializeApp({
    apiKey:                 VITE_FIREBASE_API_KEY.toString(),
    authDomain:             VITE_FIREBASE_AUTH_DOMAIN.toString(),
    projectId:              VITE_FIREBASE_PROJECT_ID.toString(),
    storageBucket:          VITE_FIREBASE_STORAGE_BUCKET.toString(),
    messagingSenderId:      VITE_FIREBASE_MESSAGING_SENDER_ID.toString(),
    appId:                  VITE_FIREBASE_APP_ID.toString(),
    measurementId:          VITE_FIREBASE_MEASUREMENT_ID.toString(),
});
export const analytics = getAnalytics(app);
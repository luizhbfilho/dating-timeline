"use client";

import { initializeApp as initializeAppSDK, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: any;
let db: any;
let auth: any;

try {
  // Check if all required config values are present
  const hasAllConfig = Object.values(firebaseConfig).every(
    (value) => value !== undefined && value !== ""
  );

  if (!hasAllConfig) {
    console.warn("Firebase config incomplete. Missing environment variables:", {
      apiKey: !firebaseConfig.apiKey,
      authDomain: !firebaseConfig.authDomain,
      projectId: !firebaseConfig.projectId,
      storageBucket: !firebaseConfig.storageBucket,
      messagingSenderId: !firebaseConfig.messagingSenderId,
      appId: !firebaseConfig.appId,
    });
  }

  // Initialize Firebase only if not already initialized
  if (getApps().length === 0 && hasAllConfig) {
    app = initializeAppSDK(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  } else if (getApps().length > 0) {
    app = getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, auth };
export default app;

"use client";

import { initializeApp as initializeAppSDK, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

let app: any;
let db: any;
let auth: any;

// Function to get Firebase config with current env vars
function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

// Function to check if config is valid
function isConfigValid(config: any) {
  return Object.values(config).every(
    (value) => value !== undefined && value !== ""
  );
}

// Initialize Firebase
function initializeFirebase() {
  try {
    const firebaseConfig = getFirebaseConfig();

    if (!isConfigValid(firebaseConfig)) {
      console.warn("Firebase config incomplete. Missing environment variables:", {
        apiKey: !firebaseConfig.apiKey,
        authDomain: !firebaseConfig.authDomain,
        projectId: !firebaseConfig.projectId,
        storageBucket: !firebaseConfig.storageBucket,
        messagingSenderId: !firebaseConfig.messagingSenderId,
        appId: !firebaseConfig.appId,
      });
      return false;
    }

    // Initialize Firebase only if not already initialized
    if (getApps().length === 0) {
      app = initializeAppSDK(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      console.log("Firebase initialized successfully");
      return true;
    } else {
      app = getApps()[0];
      db = getFirestore(app);
      auth = getAuth(app);
      console.log("Firebase already initialized");
      return true;
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return false;
  }
}

// Initialize on module load
initializeFirebase();

// Export getter functions that re-check config
export function getDb() {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

export function getAuth_() {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export { db, auth };
export default app;

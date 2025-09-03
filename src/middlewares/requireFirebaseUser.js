import dotenv from "dotenv";
dotenv.config();

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ✅ Validate required env vars
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("❌ Missing Firebase environment variables");
}

// ✅ Build credentials object
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // fix multiline key
};

// ✅ Initialize Firebase Admin SDK only once
let app;
if (!global._firebaseApp) {
  app = initializeApp({ credential: cert(firebaseConfig) });
  global._firebaseApp = app;
} else {
  app = global._firebaseApp;
}

// ✅ Export Auth service
export const adminAuth = getAuth(app);

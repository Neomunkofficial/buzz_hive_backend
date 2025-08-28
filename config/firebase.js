import dotenv from "dotenv";
// Load environment variables FIRST
dotenv.config();

import admin from "firebase-admin";

// Validate required environment variables
const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};


const firebaseConfig = {
  project_id: requiredEnvVars.projectId,
  client_email: requiredEnvVars.clientEmail,
  private_key: requiredEnvVars.privateKey.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export default admin.auth();
import admin from 'firebase-admin';

// Use the environment variable instead of reading a file
// Make sure you added FIREBASE_SERVICE_ACCOUNT in Render's environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();

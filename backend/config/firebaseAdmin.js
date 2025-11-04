import firebaseAdmin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };


if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
} 
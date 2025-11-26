// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCcAaJf33JiTU54Xg0zosO3Rl6GMgCcEck",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "career-guidance-platform-eea84.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "career-guidance-platform-eea84",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "career-guidance-platform-eea84.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "758320136319",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:758320136319:web:fb16803577d15251773f4a",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-3M9S16FTCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export the services you need
export { auth, db, analytics };

// Optional: Export the app instance if needed elsewhere
export default app;
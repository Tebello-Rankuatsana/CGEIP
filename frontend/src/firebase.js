// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcAaJf33JiTU54Xg0zosO3Rl6GMgCcEck",
  authDomain: "career-guidance-platform-eea84.firebaseapp.com",
  projectId: "career-guidance-platform-eea84",
  storageBucket: "career-guidance-platform-eea84.firebasestorage.app",
  messagingSenderId: "758320136319",
  appId: "1:758320136319:web:fb16803577d15251773f4a",
  measurementId: "G-3M9S16FTCJ"
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
// Firebase Configuration with Firestore
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// YOUR ACTUAL FIREBASE CONFIG (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyCZyPhAEF0gsms7XcOpn_UDQ7r0A66-JUU",
  authDomain: "food-express-701ea.firebaseapp.com",
  projectId: "food-express-701ea",
  storageBucket: "food-express-701ea.firebasestorage.app",
  messagingSenderId: "592190737702",
  appId: "1:592190737702:web:6973affa19859a2cf905e7"
};

// Check if using mock or real Firebase
const isUsingRealFirebase = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (!isUsingRealFirebase) {
  console.warn("⚠️ Using Mock Firebase. For real data, update firebaseConfig with your actual Firebase credentials.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

console.log(`✅ Firebase ${isUsingRealFirebase ? 'Real' : 'Mock'} Initialized`);

export { auth, db };
export default app;
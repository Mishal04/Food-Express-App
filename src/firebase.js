// Firebase Configuration with Firestore and Storage
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjm78WDdJY8HC-gDx3ArU1hEJZBr26K6M",
  authDomain: "food-express-1c38b.firebaseapp.com",
  projectId: "food-express-1c38b",
  storageBucket: "food-express-1c38b.appspot.com",
  messagingSenderId: "284377385170",
  appId: "1:284377385170:web:768a70cb57225d3c1cc50b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Firebase services directly
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
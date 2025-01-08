// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6JzzZSsBHG2287QOU6nqRVNUijaD2nTQ",
  authDomain: "eventful-ssd.firebaseapp.com",
  projectId: "eventful-ssd",
  storageBucket: "eventful-ssd.appspot.com", // Corrected the storage bucket URL
  messagingSenderId: "184589855792",
  appId: "1:184589855792:web:8d7dfad3339621a05bd1f5",
  measurementId: "G-GTXFJ906K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export the required objects
export { auth, googleProvider };

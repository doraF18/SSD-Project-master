// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6JzzZSsBHG2287QOU6nqRVNUijaD2nTQ",
  authDomain: "eventful-ssd.firebaseapp.com",
  projectId: "eventful-ssd",
  storageBucket: "eventful-ssd.appspot.com",
  messagingSenderId: "184589855792",
  appId: "1:184589855792:web:8d7dfad3339621a05bd1f5",
  measurementId: "G-GTXFJ906K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication, Google Provider, and Firestore
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

// Function to assign role to user in Firestore during registration
const assignRoleToUser = async (uid, role = 'attendee') => {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Assign default role if user doesn't exist in Firestore
    await setDoc(userDocRef, { role: role });
  }

  return userDoc.data().role; // Return the role from Firestore
};

// Function to get user role from Firestore during login or after sign in
const getUserRole = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data().role; // Return the user's role from Firestore
  }
  return 'attendee'; // Default role if not found
};

// Export required objects and functions
export { auth, googleProvider, db, assignRoleToUser, getUserRole };

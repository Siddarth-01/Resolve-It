// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBdpU06-DswBpNXsYp3jNQuK1ZztNt0ps",
  authDomain: "resolve-it-a01a9.firebaseapp.com",
  projectId: "resolve-it-a01a9",
  storageBucket: "resolve-it-a01a9.firebasestorage.app",
  messagingSenderId: "922493880923",
  appId: "1:922493880923:web:ef4bc463ec682293f04d7e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const provider = new GoogleAuthProvider();

// Export authentication functions for use in components
export { signInWithPopup, signOut, onAuthStateChanged };

export default app;

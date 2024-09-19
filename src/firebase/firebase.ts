// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, memoryLocalCache, persistentLocalCache } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9jwO8zMER2O5-CHiW1lGtzaYTM_5QqXg",
  authDomain: "gestone-d508a.firebaseapp.com",
  projectId: "gestone-d508a",
  storageBucket: "gestone-d508a.appspot.com",
  messagingSenderId: "382008916816",
  appId: "1:382008916816:web:19f74b882d17a6d6fc8a55",
  measurementId: "G-Y4RN9ZK20K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
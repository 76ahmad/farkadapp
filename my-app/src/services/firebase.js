// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA9r4nbD1R4Uh8_F3dx8lUbj2vD0AG6v2s",
  authDomain: "farkad-scheduler.firebaseapp.com",
  projectId: "farkad-scheduler",
  storageBucket: "farkad-scheduler.appspot.com",
  messagingSenderId: "71149615141",
  appId: "1:71149615141:web:97eac63fe0c39d4831a7cc",
  measurementId: "G-41H0PK4LMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
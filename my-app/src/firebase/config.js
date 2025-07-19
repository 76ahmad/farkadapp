// firebase/config.js - إعداد Firebase بشكل صحيح
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.error('Please create a .env file with the required Firebase configuration.');
  throw new Error('Missing Firebase configuration. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Analytics safely
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
        console.log('✅ Analytics initialized successfully');
      } catch (error) {
        console.warn('⚠️ Analytics initialization failed, continuing without it:', error.message);
        analytics = null;
      }
    } else {
      console.log('ℹ️ Analytics not supported in this environment');
    }
  }).catch((error) => {
    console.warn('⚠️ Analytics support check failed:', error.message);
    analytics = null;
  });
}

// Connect to Firestore Emulator in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
  try {
    console.log('🔧 Connecting to Firestore Emulator...');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Connected to Firestore Emulator');
  } catch (error) {
    console.log('ℹ️ Firestore Emulator already connected or not available');
  }
}

// Export variables
export { db, auth, analytics };
export default app;
// firebase/config.js - إعداد Firebase بإعداداتك الحقيقية (محسن)
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyA9r4nbD1R4Uh8_F3dx8lUbj2vD0AG6v2s",
  authDomain: "farkad-scheduler.firebaseapp.com",
  projectId: "farkad-scheduler",
  storageBucket: "farkad-scheduler.firebasestorage.app",
  messagingSenderId: "71149615141",
  appId: "1:71149615141:web:6a01aa5f3d6c69db31a7cc",
  measurementId: "G-ZGQVM1C0SS"
};

// متغيرات Firebase
let app;
let db;
let auth;
let analytics = null;

try {
  // تهيئة Firebase
  console.log('🔄 Initializing Firebase with project:', firebaseConfig.projectId);
  app = initializeApp(firebaseConfig);
  
  // تهيئة Firestore Database
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
  // تهيئة Authentication
  auth = getAuth(app);
  console.log('✅ Auth initialized successfully');
  
  // تهيئة Analytics بشكل آمن (فقط إذا كان مدعوماً)
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
  
  // للتطوير المحلي - Firebase Emulator (إذا كنت تستخدمه)
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
    try {
      console.log('🔧 Connecting to Firestore Emulator...');
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Connected to Firestore Emulator');
    } catch (error) {
      console.log('ℹ️ Firestore Emulator already connected or not available');
    }
  }
  
  console.log('🎉 Firebase setup completed successfully!');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // في حالة فشل Firebase، استخدم بيانات وهمية
  console.warn('⚠️ Falling back to mock data mode');
  db = null;
  auth = null;
  analytics = null;
}

// تصدير المتغيرات
export { db, auth, analytics };
export default app;

// Helper function للتحقق من حالة Firebase
export const isFirebaseReady = () => {
  return db !== null && db !== undefined;
};

// Helper function للحصول على معلومات المشروع
export const getProjectInfo = () => {
  return {
    projectId: firebaseConfig.projectId,
    isReady: isFirebaseReady(),
    timestamp: new Date().toISOString()
  };
};


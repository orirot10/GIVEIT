import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCZpXDxunDa9dHHO6bz2v4ncKTOmEpUwWM",
  authDomain: "givitori.firebaseapp.com",
  projectId: "givitori",
  storageBucket: "givitori.appspot.com", // תקן כאן, זה לא "firebasestorage.app"
  messagingSenderId: "552189348251",
  appId: "1:552189348251:web:482bdf4500beebe934b93e",
  measurementId: "G-BQYJMH3Y7X"
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ Initialize analytics if supported
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((e) => console.log('Analytics not supported:', e.message));

// ✅ Configure Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ✅ Export everything
export { db, auth, storage, analytics, googleProvider };

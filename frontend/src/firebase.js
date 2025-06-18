import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZpXDxunDa9dHHO6bz2v4ncKTOmEpUwWM",
  authDomain: "givitori.firebaseapp.com",
  projectId: "givitori",
  storageBucket: "givitori.firebasestorage.app",
  messagingSenderId: "552189348251",
  appId: "1:552189348251:web:482bdf4500beebe934b93e",
  measurementId: "G-BQYJMH3Y7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
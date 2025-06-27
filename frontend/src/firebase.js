import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZpXDxunDa9dHHO6bz2v4ncKTOmEpUwWM",
  authDomain: "givitori.firebaseapp.com",
  projectId: "givitori",
  storageBucket: "givitori.appspot.com",
  messagingSenderId: "552189348251",
  appId: "1:552189348251:web:482bdf4500beebe934b93e",
  measurementId: "G-BQYJMH3Y7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize analytics only if supported
let analytics = null;
isSupported().then(yes => {
  if (yes) analytics = getAnalytics(app);
}).catch(e => console.log('Analytics not supported:', e.message));

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Check if we're in a local development environment
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

// Connect to emulators in development
if (isLocalhost) {
  // Check if we should use emulators
  const useEmulators = false; // Set to true to use emulators, false to use production services
  
  if (useEmulators) {
    try {
      // Connect to Auth emulator
      //connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('✅ Connected to Firebase Auth Emulator');
      
      // Connect to Firestore emulator
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Connected to Firestore Emulator');
      
      // Connect to Storage emulator
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('✅ Connected to Storage Emulator');
    } catch (error) {
      console.error('❌ Failed to connect to Firebase Emulators:', error);
      console.warn('Make sure to run: firebase emulators:start');
    }
  } else {
    console.log('🔥 Using production Firebase services');
  }
}

export { db, auth, storage, analytics, googleProvider };
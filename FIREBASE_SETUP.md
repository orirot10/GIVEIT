# Firebase Authentication Setup

This project uses Firebase Authentication for user sign-up and login functionality. Follow these steps to set up Firebase for this project:

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics if desired

## 2. Set Up Firebase Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
4. Enable the "Google" sign-in method:
   - Click on the Google provider
   - Enable it and configure the settings
   - Add your project's domain to the authorized domains list
   - Save the changes

## 3. Create a Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in production mode or test mode as needed
4. Choose a location for your database

## 4. Set Up Firebase Admin SDK

1. In your Firebase project, go to "Project settings" (gear icon)
2. Go to the "Service accounts" tab
3. Click "Generate new private key"
4. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend` directory
5. **IMPORTANT**: Never commit this file to version control!

## 5. Update Environment Variables

### Backend (.env)

```
# Firebase (for production, encode this JSON as a string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}

# Other environment variables
PORT=5000
NODE_ENV=development
```

### Frontend (.env)

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 6. Update Firebase Configuration

If you need to modify the Firebase configuration, update the following files:

- Frontend: `frontend/src/firebase.js`
- Backend: `backend/config/firebase.js`

## 7. Firestore Security Rules

Update your Firestore security rules in the Firebase Console or in `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add rules for other collections as needed
  }
}
```

## 8. Testing Authentication

After setting up Firebase, you can test authentication by:

1. Starting the backend server: `cd backend && npm start`
2. Starting the frontend: `cd frontend && npm run dev`
3. Navigate to the signup page and create a new account
4. Try logging in with the created account
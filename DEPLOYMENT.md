# Deployment Guide

This guide will help you deploy your application with Firebase authentication.

## Backend Deployment

### Prerequisites
1. Make sure you have a Firebase project set up
2. Generate a service account key from the Firebase console

### Setting up Firebase Service Account

#### Option 1: Using Environment Variables (Recommended for Production)

1. Convert your `serviceAccountKey.json` to a string:
   ```
   const serviceAccount = require('./serviceAccountKey.json');
   console.log(JSON.stringify(serviceAccount));
   ```

2. Set the environment variable in your deployment platform:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: The JSON string from step 1

#### Option 2: Using a File (Development Only)

1. Copy `serviceAccountKey.example.json` to `serviceAccountKey.json`
2. Fill in your actual Firebase service account details
3. **IMPORTANT**: Never commit this file to version control!

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON as a string
     - `NODE_ENV`: `production`
     - Other environment variables as needed

4. Click "Create Web Service"

### Troubleshooting Deployment Issues

If you encounter the error `Cannot find module 'firebase-admin'`:

1. Make sure `firebase-admin` is in your `package.json` dependencies
2. Run `npm install` locally to update your package-lock.json
3. Commit and push the updated package.json and package-lock.json
4. Redeploy your application

## Frontend Deployment

1. Update your frontend Firebase configuration in `.env`:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

2. Build your frontend:
   ```
   cd frontend
   npm run build
   ```

3. Deploy the built files to your hosting provider of choice (Netlify, Vercel, Firebase Hosting, etc.)

## Important Security Notes

1. Always use environment variables for sensitive information in production
2. Never commit service account keys or API keys to version control
3. Set up proper Firebase security rules to protect your data
4. Configure CORS in your backend to only allow requests from your frontend domain
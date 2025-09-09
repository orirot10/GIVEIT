# Deploy Firebase Storage Rules

To fix the image upload issue, you need to deploy the storage rules to Firebase:

## Steps:

1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not done):
   ```bash
   firebase init storage
   ```

4. Deploy the storage rules:
   ```bash
   firebase deploy --only storage
   ```

## Alternative: Manual Setup

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `givitori`
3. Go to Storage > Rules
4. Replace the rules with the content from `storage.rules` file
5. Click "Publish"

## Storage Rules Content:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images to their own folder
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to all images
    match /images/{allPaths=**} {
      allow read: if true;
    }
  }
}
```
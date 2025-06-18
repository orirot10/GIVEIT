# How to Fix Firebase Unauthorized Domain Error

When you see the error `Firebase: Error (auth/unauthorized-domain)` during Google sign-in, it means your application's domain isn't authorized in Firebase.

## Steps to Fix:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (giveit-3003)
3. In the left sidebar, click on **Authentication**
4. Click on the **Settings** tab
5. Scroll down to the **Authorized domains** section
6. Click **Add domain**
7. Add your application domains:
   - `localhost`
   - `127.0.0.1`
   - `giveit-frontend.onrender.com` (your production domain)
   - Any other domains where your app is hosted
8. Click **Add**

## For Local Development:

If testing locally, make sure `localhost` and `127.0.0.1` are in the authorized domains list.

## For Production:

Make sure your production domain (e.g., `giveit-frontend.onrender.com`) is in the authorized domains list.

## After Adding Domains:

After adding the domains, you'll need to:
1. Wait a few minutes for the changes to propagate
2. Refresh your application
3. Try the Google sign-in again
# Google Authentication Fix for Android

## Problem
Google Sign-In was failing in the Capacitor Android app with errors like "disallowed_useragent" or "This browser is not secure" because the WebView doesn't support Google OAuth directly.

## Solution
Implemented native Google Sign-In using the `@codetrix-studio/capacitor-google-auth` plugin with Chrome Custom Tabs.

## Changes Made

### 1. Firebase Console Configuration
- **Package Name**: `com.orirot.givit`
- **SHA-1 Fingerprint**: `56:40:F6:38:85:BA:7F:67:AD:45:C3:CF:62:65:D6:FA:99:C6:C6:F0`
- **Client IDs**:
  - Web Client ID: `552189348251-93esjcu95at9ji45ugnddd60nistmqb6.apps.googleusercontent.com`
  - Android Client ID: `552189348251-efl1d4ch20i43qooj9bt35m0ebkr05od.apps.googleusercontent.com`

### 2. Android Configuration
- Updated `build.gradle` with latest Google Play Services
- Added Firebase Auth dependency
- Created `proguard-rules.pro` for release builds
- Simplified `AndroidManifest.xml`

### 3. Capacitor Configuration
- Configured `GoogleAuth` plugin in `capacitor.config.json`
- Uses web client ID as `serverClientId`

### 4. Code Changes
- Fixed `AuthContext.jsx` to properly initialize and use native Google Auth
- Added better error handling and logging
- Created device detection utility

## Testing
1. Run `fix-google-auth.bat` to build and install
2. Test Google Sign-In on physical device
3. Check logs for any errors

## Important Notes
- SHA-1 fingerprint must be added to Firebase Console
- Native plugin only works on physical devices, not emulator
- Web client ID is used for both web and native authentication
# Push Notifications Troubleshooting Guide

## Quick Fixes Applied

### 1. Fixed Service Initialization
- ✅ Added proper permission checking before registration
- ✅ Added listener cleanup to prevent duplicates
- ✅ Improved error handling and logging
- ✅ Added reinitialize method for debugging

### 2. Fixed App Integration
- ✅ Moved initialization to App.jsx with proper timing
- ✅ Removed duplicate initialization from main.jsx
- ✅ Added cleanup on user logout

### 3. Added Debug Tools
- ✅ Created NotificationTest component in Dashboard
- ✅ Added comprehensive logging

## Testing Steps

### 1. Build and Test
```bash
npm run build
npx cap sync android
npx cap run android
```

### 2. Check Dashboard
- Open the app and login
- Go to Dashboard
- Use the "Notification Test" component
- Check the status and token

### 3. Check Logs
```bash
# Android logs
npx cap run android --livereload --external
# Then check browser console and Android Studio logcat
```

## Common Issues & Solutions

### Issue 1: "Permissions denied"
**Solution:**
- Go to Android Settings > Apps > Givit > Notifications
- Enable all notification permissions
- Restart the app

### Issue 2: "No token received"
**Solution:**
- Ensure `google-services.json` is in `android/app/`
- Check Firebase project configuration
- Verify SHA-1 fingerprint in Firebase Console

### Issue 3: "Service not initialized"
**Solution:**
- Check if user is logged in
- Use the "Reinitialize" button in NotificationTest
- Check browser console for errors

### Issue 4: "Notifications not showing"
**Solution:**
- Test with app in background
- Check notification channel settings
- Verify Firebase Cloud Messaging setup

## Firebase Setup Checklist

### 1. Firebase Console
- ✅ Project created
- ✅ Android app added with correct package name
- ✅ `google-services.json` downloaded and placed in `android/app/`
- ✅ Cloud Messaging enabled

### 2. SHA-1 Fingerprint
```bash
# Get debug SHA-1
cd android
./gradlew signingReport
```
Add the SHA-1 to Firebase Console > Project Settings > Your Apps

### 3. Test Token
Use Firebase Console > Cloud Messaging > Send test message with the token from NotificationTest

## Android Specific Checks

### 1. Permissions in AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### 2. Firebase Service Registration
```xml
<service android:name=".FirebaseMessagingService" android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

### 3. Build Dependencies
```gradle
implementation "com.google.firebase:firebase-messaging:24.0.3"
```

## iOS Specific Setup (Future)

### 1. Add iOS Permissions
```xml
<!-- In ios/App/App/Info.plist -->
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

### 2. Firebase iOS Setup
- Add `GoogleService-Info.plist` to iOS project
- Configure APNs certificates in Firebase Console

## Debug Commands

### 1. Check Capacitor Status
```bash
npx cap doctor
```

### 2. Clean and Rebuild
```bash
npm run build
npx cap sync android --force
cd android && ./gradlew clean
npx cap run android
```

### 3. Check Firebase Connection
```bash
# In Android Studio, check logcat for Firebase messages
adb logcat | grep -i firebase
```

## Production Checklist

- [ ] Remove NotificationTest component from Dashboard
- [ ] Test on physical device (not emulator)
- [ ] Test with app in background/killed
- [ ] Test notification actions/deep links
- [ ] Verify token is sent to backend
- [ ] Test with real Firebase messages

## Backend Integration

Ensure your backend sends notifications in this format:
```json
{
  "to": "FCM_TOKEN",
  "notification": {
    "title": "New Message",
    "body": "You have a new message from John"
  },
  "data": {
    "senderId": "user123",
    "senderName": "John Doe",
    "action": "openMessages"
  }
}
```
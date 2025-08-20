# Push Notifications Implementation Guide

## Setup Complete ✅

Your Capacitor Android app now has complete push notification support for chat messages using Firebase Cloud Messaging (FCM).

## What's Implemented

### Frontend (Capacitor)
- ✅ Notification service initialization on user login
- ✅ FCM token registration and server sync
- ✅ Foreground notification suppression when conversation is open
- ✅ Deep-link handling for notification taps
- ✅ Enhanced notification handler with conversation tracking

### Backend (Node.js)
- ✅ FCM token storage in User model
- ✅ Push notification sending on new messages
- ✅ Enhanced notification payload with sender info
- ✅ Android-specific notification configuration

### Android (Native)
- ✅ Firebase messaging service with notification channel
- ✅ Deep-link intent handling in MainActivity
- ✅ High-priority notification configuration

## Required Configuration

### 1. Firebase Project Setup
Ensure your `google-services.json` file is properly configured:
- File location: `frontend/android/app/google-services.json`
- Must match your app's package ID: `com.orirot.givit`
- Include both debug and release SHA fingerprints

### 2. Generate SHA Fingerprints
```bash
# Debug SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release SHA-1 (use your release keystore)
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

### 3. Backend Firebase Admin Setup
Ensure your backend has the Firebase Admin SDK configured:
- Service account key in `backend/config/serviceAccountKey.json`
- Firebase Admin initialized in your server

## How It Works

### Message Flow
1. User sends message → Backend saves to database
2. Backend triggers `sendPushNotification()` function
3. FCM sends notification to recipient's device
4. Android shows system notification (if app in background)
5. User taps notification → App opens to messages page
6. If app is in foreground and conversation is open → Notification suppressed

### Foreground Suppression
- Tracks active conversation in NotificationHandler
- Suppresses notifications when recipient is viewing the sender's conversation
- Shows in-app notifications for other conversations

### Deep Linking
- Notification tap opens Messages page
- Enhanced with sender info for direct conversation access
- Handles both cold start and warm resume scenarios

## Testing

### 1. Test Notification Delivery
```bash
# Send test from Firebase Console
# Use FCM token from app logs: "Push registration success, token: ..."
```

### 2. Test Scenarios
- ✅ Background: App closed → Notification appears → Tap opens messages
- ✅ Foreground (different conversation): Notification appears
- ✅ Foreground (same conversation): Notification suppressed
- ✅ Deep link: Notification tap navigates to correct conversation

### 3. Debug Logs
Check Android logs for:
- `FCM` - Firebase messaging
- `PushPlugin` - Capacitor push notifications
- `MainActivity` - Deep link handling

## Build Commands

```bash
# Frontend
cd frontend
npm run build
npx cap sync android
npx cap open android

# Build APK in Android Studio or
./gradlew assembleDebug
```

## Troubleshooting

### No Notifications Received
1. Check `google-services.json` is correct
2. Verify SHA fingerprints in Firebase Console
3. Ensure FCM token is being sent to backend
4. Check backend Firebase Admin SDK setup

### Notifications Not Opening App
1. Verify MainActivity deep link handling
2. Check notification intent flags
3. Ensure NotificationHandler is mounted in App.jsx

### Foreground Suppression Not Working
1. Check activeConversation state in NotificationHandler
2. Verify location.state.contactId is set correctly
3. Ensure senderId matches activeConversation

## Security Notes

- FCM tokens are securely stored and associated with authenticated users
- Notification content is truncated for privacy (100 chars max)
- Invalid tokens are automatically cleaned up by FCM error handling
- All API endpoints require authentication

Your push notification system is now fully functional! 🎉
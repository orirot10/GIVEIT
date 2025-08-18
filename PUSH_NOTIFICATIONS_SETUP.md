# Push Notifications Setup for Android

## Installation Steps

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Sync Capacitor:**
   ```bash
   npx cap sync android
   ```

3. **Build the app:**
   ```bash
   npm run build
   npx cap copy android
   ```

4. **Open Android Studio:**
   ```bash
   npx cap open android
   ```

## Firebase Configuration

1. Ensure `google-services.json` is in `android/app/` directory
2. Firebase Cloud Messaging should be enabled in your Firebase project
3. The app will automatically request notification permissions on startup

## How It Works

### Frontend
- **NotificationService**: Handles FCM token registration and notification events
- **NotificationHandler**: Manages in-app notification display and navigation
- Automatically initializes on app startup

### Backend
- **FCM Token Storage**: User model stores FCM tokens
- **Push Notification Sending**: Messages trigger push notifications
- **API Endpoint**: `/api/users/fcm-token` for token updates

### Android Native
- **FirebaseMessagingService**: Handles incoming push notifications
- **MainActivity**: Registers push notification plugin
- **Permissions**: POST_NOTIFICATIONS and WAKE_LOCK

## Features

- ✅ Push notifications when receiving messages
- ✅ Foreground notification handling
- ✅ Notification tap navigation to messages
- ✅ Automatic FCM token management
- ✅ Android 13+ notification permissions

## Testing

1. Send a message from another user
2. Put the app in background
3. You should receive a push notification
4. Tap the notification to open the app and navigate to messages

## Troubleshooting

- Ensure Firebase project has Cloud Messaging enabled
- Check that `google-services.json` is properly configured
- Verify notification permissions are granted
- Check device logs for FCM token registration
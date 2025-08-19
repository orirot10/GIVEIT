@echo off
echo Fixing Google Auth for Android...

echo 1. Syncing Capacitor...
call npx cap sync android

echo 2. Cleaning Android build...
cd android
call gradlew clean

echo 3. Building debug APK...
call gradlew assembleDebug

echo 4. Installing on device...
call gradlew installDebug

echo Google Auth fix complete!
echo.
echo IMPORTANT: Make sure you have added the SHA-1 fingerprint to Firebase Console:
echo SHA-1: 56:40:F6:38:85:BA:7F:67:AD:45:C3:CF:62:65:D6:FA:99:C6:C6:F0
echo.
echo Go to: https://console.firebase.google.com/project/givitori/settings/general
echo Add this SHA-1 to your Android app configuration.
pause
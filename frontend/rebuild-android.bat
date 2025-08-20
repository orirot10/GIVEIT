@echo off
echo Building and syncing Android app...

echo Step 1: Building web assets...
npm run build

echo Step 2: Syncing with Capacitor...
npx cap sync android

echo Step 3: Opening Android Studio...
npx cap open android

echo Done! Make sure to:
echo 1. Check the network logs in Android Studio
echo 2. Test on a real device with internet connection
echo 3. Check if the backend URL is reachable from the device

pause
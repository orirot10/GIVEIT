@echo off
echo Building web app...
npm run build

echo Syncing to iOS...
npx cap sync ios

echo Build complete! You can now open the project in Xcode:
echo npx cap open ios

pause
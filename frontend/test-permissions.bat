@echo off
echo Testing notification permissions...
echo.
echo 1. Build and sync
npm run build
npx cap sync android

echo.
echo 2. Run app
echo Look for permission dialog when app starts
npx cap run android

pause
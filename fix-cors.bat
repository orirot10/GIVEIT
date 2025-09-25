@echo off
echo Deploying Firebase Storage Rules...
firebase deploy --only storage

echo.
echo Configuring CORS for Firebase Storage...
gsutil cors set storage.cors.json gs://givitori.firebasestorage.app

echo.
echo CORS fix complete!
pause
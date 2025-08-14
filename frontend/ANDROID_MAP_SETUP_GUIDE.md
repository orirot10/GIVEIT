# Android Map Setup Guide

## Problem Description
The map works in the web browser but doesn't display in the Android APK. This is a common issue with Capacitor apps and Google Maps in WebView environments.

## Root Causes
1. **Missing Google Maps API Key**: The API key is not properly configured for Android
2. **WebView Compatibility Issues**: Google Maps has known issues with Android WebView
3. **Missing Dependencies**: Some Android-specific dependencies may be missing
4. **Capacitor Configuration**: WebView settings need optimization for maps

## Solutions Implemented

### 1. Google Maps API Key Setup

**IMPORTANT**: You need to set up a proper Google Maps API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Android Maps SDK
   - Places API (if using places features)
4. Create credentials (API Key)
5. Restrict the API key to Android apps with your package name: `com.orirot.givit`

**Update the API key in these files:**

#### A. Android Strings Resource
```xml
<!-- frontend/android/app/src/main/res/values/strings.xml -->
<string name="google_maps_key">YOUR_ACTUAL_API_KEY_HERE</string>
```

#### B. Capacitor Config
```json
<!-- frontend/capacitor.config.json -->
"GoogleMaps": {
  "apiKey": "YOUR_ACTUAL_API_KEY_HERE"
}
```

### 2. Android Dependencies Updated

The following dependencies have been added to `android/app/build.gradle`:

```gradle
// Google Maps and Location Services
implementation "com.google.android.gms:play-services-maps:18.2.0"
implementation "com.google.android.gms:play-services-location:21.2.0"
implementation "com.google.android.gms:play-services-base:18.3.0"

// WebView improvements for maps
implementation "androidx.webkit:webkit:1.8.0"
```

### 3. Capacitor Configuration Optimized

Updated `capacitor.config.json` with Android-specific settings:

```json
"android": {
  "webContentsDebuggingEnabled": true,
  "allowMixedContent": true,
  "captureInput": true,
  "webContentsOpaque": false,
  "backgroundColor": "#ffffff"
}
```

### 4. MapView Component Enhanced

Added Android WebView-specific handling:
- Platform detection
- WebView initialization fixes
- Error recovery mechanisms
- Fallback UI for map failures

## Build and Test Steps

### 1. Update API Keys
Replace all instances of `YOUR_API_KEY_HERE` with your actual Google Maps API key.

### 2. Rebuild the App
```bash
cd frontend
npm run build
npx cap sync android
npx cap build android
```

### 3. Test on Device
- Install the APK on your Android device
- Grant location permissions when prompted
- Check console logs for any errors

### 4. Debug Information
The app now includes extensive logging for Android WebView issues. Check the console for:
- Platform detection
- Map initialization status
- WebView-specific fixes applied
- Any error recovery attempts

## Common Issues and Solutions

### Issue: Map shows blank/white screen
**Solution**: Check that your API key is correct and has the right permissions

### Issue: Map loads but doesn't respond to touch
**Solution**: This is a WebView issue - the app now includes automatic recovery

### Issue: Map tiles don't load
**Solution**: Ensure internet permissions are granted and the device has internet access

### Issue: App crashes when opening map
**Solution**: Check that all Android dependencies are properly synced

## Additional Android Optimizations

### 1. WebView Settings
The app now includes optimized WebView settings for better map performance.

### 2. Error Recovery
Automatic recovery mechanisms for common WebView map issues.

### 3. Fallback UI
User-friendly error messages and retry options when maps fail to load.

## Testing Checklist

- [ ] API key is properly set in `strings.xml`
- [ ] API key is properly set in `capacitor.config.json`
- [ ] App has internet permission
- [ ] App has location permission
- [ ] Device has internet connection
- [ ] Google Play Services are up to date
- [ ] App is built with latest dependencies

## Support

If issues persist after following this guide:
1. Check the console logs for specific error messages
2. Verify your Google Maps API key permissions
3. Test on different Android devices/versions
4. Ensure all dependencies are properly synced

## Notes

- The map may take a few seconds to load on first launch in Android
- Some WebView issues are device-specific and may require app restart
- The app now includes automatic recovery for most common issues
- Performance may vary depending on the Android device and WebView version

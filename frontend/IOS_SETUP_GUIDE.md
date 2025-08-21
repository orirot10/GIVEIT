# iOS Setup Guide for Giveit App

## Prerequisites

1. **macOS**: iOS development requires macOS with Xcode
2. **Xcode**: Install from Mac App Store (latest version recommended)
3. **iOS Simulator**: Comes with Xcode
4. **Apple Developer Account**: Required for device testing and App Store deployment

## Development Workflow

### Quick Commands

```bash
# Build and sync to iOS
npm run ios:build

# Open in Xcode
npm run ios:open

# Build, sync, and run on simulator
npm run ios:run
```

### Manual Steps

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync to iOS:**
   ```bash
   npx cap sync ios
   ```

3. **Open in Xcode:**
   ```bash
   npx cap open ios
   ```

## iOS-Specific Configuration

The app is configured with:
- App ID: `com.orirot.givit`
- App Name: `Givit`
- Background color: White (#ffffff)
- Web contents debugging enabled for development

## Required iOS Permissions

Add these to `ios/App/App/Info.plist` if needed:

```xml
<!-- Location permissions -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show nearby rentals and services.</string>

<!-- Camera permissions -->
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos of items.</string>

<!-- Photo library permissions -->
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to select images.</string>

<!-- Push notifications -->
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

## Google Maps Setup for iOS

1. Get an iOS API key from Google Cloud Console
2. Update `capacitor.config.json`:
   ```json
   "GoogleMaps": {
     "apiKey": "YOUR_IOS_GOOGLE_MAPS_API_KEY"
   }
   ```

## Google Auth Setup for iOS

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to `ios/App/App/` directory
3. Update the server client ID in `capacitor.config.json`

## Building for Production

1. **Archive in Xcode:**
   - Product → Archive
   - Upload to App Store Connect

2. **Or use command line:**
   ```bash
   # Build for device
   npx cap run ios --target="Your Device Name"
   ```

## Troubleshooting

### Common Issues:

1. **CocoaPods not installed:**
   ```bash
   sudo gem install cocoapods
   ```

2. **Xcode command line tools:**
   ```bash
   xcode-select --install
   ```

3. **Clean and rebuild:**
   ```bash
   npx cap sync ios --force
   ```

### Plugin Issues:

If plugins don't work, try:
```bash
cd ios/App
pod install
```

## Testing

- **Simulator**: Use iOS Simulator (comes with Xcode)
- **Device**: Connect iPhone/iPad via USB, enable Developer Mode
- **TestFlight**: For beta testing before App Store release
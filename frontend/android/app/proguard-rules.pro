# Add project specific ProGuard rules here.

# Keep Google Auth classes
-keep class com.google.android.gms.** { *; }
-keep class com.google.firebase.** { *; }
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep class com.codetrix.studio.capacitor.GoogleAuth.** { *; }
-dontwarn com.getcapacitor.**

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Google Maps optimizations
-keep class com.google.android.gms.maps.** { *; }
-keep interface com.google.android.gms.maps.** { *; }
-dontwarn com.google.android.gms.maps.**

# WebView optimizations
-keep class android.webkit.** { *; }
-dontwarn android.webkit.**
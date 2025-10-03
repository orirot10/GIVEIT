package com.orirot.givit;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Optimize WebView for map performance
        optimizeWebView();
        
        handleNotificationIntent(getIntent());
    }
    
    private void optimizeWebView() {
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            
            // Enable hardware acceleration
            webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
            
            // Optimize for maps
            settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            settings.setAppCacheEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            
            // Performance optimizations
            settings.setGeolocationEnabled(true);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);
            settings.setLoadWithOverviewMode(true);
            settings.setUseWideViewPort(true);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNotificationIntent(intent);
    }

    private void handleNotificationIntent(Intent intent) {
        if (intent == null) {
            return;
        }

        boolean openMessages = intent.getBooleanExtra("openMessages", false);
        String senderId = intent.getStringExtra("senderId");
        String senderName = intent.getStringExtra("senderName");

        if (openMessages || senderId != null) {
            JSObject data = new JSObject();
            if (openMessages) {
                data.put("action", "openMessages");
            }
            if (senderId != null) {
                data.put("senderId", senderId);
                if (senderName != null) {
                    data.put("senderName", senderName);
                }
            }

            if (getBridge() != null) {
                getBridge().triggerJSEvent("notificationTapped", "window", data.toString());
            }
        }
    }
}
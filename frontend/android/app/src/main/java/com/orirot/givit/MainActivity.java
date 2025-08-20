package com.orirot.givit;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleNotificationIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNotificationIntent(intent);
    }

    private void handleNotificationIntent(Intent intent) {
        if (intent != null && intent.getBooleanExtra("openMessages", false)) {
            JSObject data = new JSObject();
            data.put("action", "openMessages");
            
            if (getBridge() != null) {
                getBridge().triggerJSEvent("notificationTapped", "window", data.toString());
            }
        }
    }
}
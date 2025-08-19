package com.orirot.givit;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.codetrix.studio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register the GoogleAuth plugin
        registerPlugin(GoogleAuth.class);
    }
}
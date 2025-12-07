package com.aden.live;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onBackPressed() {
        // Get the WebView from the bridge
        WebView webView = this.bridge.getWebView();
        
        // Check if WebView can go back
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            // If WebView can't go back, call the default behavior
            super.onBackPressed();
        }
    }
}

package app.momentum.offline;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.os.SystemClock;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;

public class MainActivity extends BridgeActivity {
    private long lastHomeBack = 0;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() == null || getBridge().getWebView() == null) return;
                getBridge().getWebView().evaluateJavascript(
                    "window.momentumHandleBack ? window.momentumHandleBack() : true",
                    result -> {
                        if (!"false".equals(result)) { lastHomeBack = 0; return; }
                        long now = SystemClock.elapsedRealtime();
                        if (lastHomeBack != 0 && now - lastHomeBack < 2000) {
                            lastHomeBack = 0;
                            moveTaskToBack(true);
                        } else {
                            lastHomeBack = now;
                            Toast.makeText(MainActivity.this, "Press Back again to leave Momentum", Toast.LENGTH_SHORT).show();
                        }
                    }
                );
            }
        });
    }
}

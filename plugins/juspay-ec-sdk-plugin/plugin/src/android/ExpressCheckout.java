package in.juspay.ec.hybrid;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;

import android.webkit.WebView;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import in.juspay.juspaysafe.BrowserCallback;
import in.juspay.juspaysafe.BrowserParams;
import in.juspay.godel.analytics.GodelTracker;

import in.juspay.ec.sdk.checkout.MobileWebCheckout;
import in.juspay.ec.sdk.api.Environment;
import in.juspay.ec.sdk.api.PaymentInstrument;
import in.juspay.ec.sdk.api.ExpressCheckoutService;

public class ExpressCheckout extends CordovaPlugin {

    private static final String PAYMENT = "JuspayStartPayment";
    private static final String TRACK_STATUS = "JuspayTrackStatus";

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        try {
            if(action.equals(PAYMENT)) {
                doPayment(args.optJSONObject(0), callbackContext);
                return true;
            }
        } catch(JSONException e) {
            e.printStackTrace();
            throw e;
        }

        return false;
    }


    private void doPayment(JSONObject params, final CallbackContext callbackContext) throws JSONException {
        JSONArray endUrlRegexJSON = params.optJSONArray("endUrlRegexes");
        String[] endUrlRegexes = null;

        JSONArray instrumentsString = params.getJSONArray("instruments");
        PaymentInstrument[] instruments = new PaymentInstrument[instrumentsString.length()];

        for(int i=0;i<instrumentsString.length();i+=1){
            instruments[i] = PaymentInstrument.valueOf(instrumentsString.getString(i));
        }

        if(endUrlRegexJSON != null) {
            endUrlRegexes = new String[endUrlRegexJSON.length()];

            for(int i=0;i<endUrlRegexJSON.length();i+=1) {
                endUrlRegexes[i] = endUrlRegexJSON.getString(i);
            }
        }

        Environment.configure(getEnvFor(params.getString("environment")), params.getString("merchantId"));

        MobileWebCheckout checkout = new MobileWebCheckout(
                                                           params.getString("orderId"),
                                                           endUrlRegexes,
                                                           instruments
                                                           );

        BrowserParams browserParams = new BrowserParams();
        JSONObject stylingParams = params.optJSONObject("actionBar");
        if(stylingParams != null) {
            String actionBarIcon = stylingParams.optString("icon", null);
            String actionBarBackgroundColor = stylingParams.optString("backgroundColor", null);
            String actionBarBackgroundImage = stylingParams.optString("backgroundImage", null);
            String displayNote = stylingParams.optString("displayNote", null);
            String remarks = stylingParams.optString("remarks",null);

            Activity activity = this.cordova.getActivity();

            if(actionBarIcon != null) {
                browserParams.setActionBarIcon(getDrawableForName(actionBarIcon, activity));
            }

            if(actionBarBackgroundColor != null) {
                browserParams.setActionBarBackgroundColor(new ColorDrawable(Color.parseColor(actionBarBackgroundColor)));
            }

            if(actionBarBackgroundImage != null) {
                browserParams.setActionBarBackgroundImage(getDrawableForName(actionBarBackgroundImage, activity));
            }

            if(displayNote != null) {
                browserParams.setDisplayNote(displayNote);
            }

            if(remarks != null) {
                browserParams.setRemarks(remarks);
            }
        }

        /**
         * Here we ensure that we call the same function by specifiying the same callback
         * on JS side
         */
        checkout.startPayment(this.cordova.getActivity(), browserParams, new BrowserCallback() {
                @Override
                public void endUrlReached(WebView wv, JSONObject data) {
                    try {
                        JSONObject obj = new JSONObject();
                        obj.put("_method", "endUrlReached");
                        obj.put("data", data);

                        callbackContext.success(obj);
                    } catch(Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }

                @Override
                public void onTransactionAborted(JSONObject data) {
                    try {
                        JSONObject obj = new JSONObject();
                        obj.put("_method", "onTransactionAborted");
                        obj.put("data", data);
                        callbackContext.success(obj);
                    } catch(Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });
    }

    private static Drawable getDrawableForName(String name, Activity activity) {
        int id = activity.getResources().getIdentifier(name, "drawable", activity.getPackageName());
        return activity.getResources().getDrawable(id);
    }

    private static @Environment.Env String getEnvFor(String env) {
        if(env.equals("SANDBOX")) {
            return Environment.SANDBOX;
        } else if(env.equals("PRODUCTION")) {
            return Environment.PRODUCTION;
        } else if(env.equals("LOCAL")) {
            return Environment.LOCAL;
        }

        return Environment.SANDBOX;
    }
}

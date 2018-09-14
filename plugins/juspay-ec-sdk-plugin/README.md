# PhoneGap app integration

JusPay has a native android and iOS client which can be used by PhoneGap applications. To get started, you first need to download the code for the plugin.

## Installation
This requires phonegap/cordova CLI 5.0+ (current stable v1.5.3).

Install via repo url directly (latest version)
```sh
phonegap plugin add https://bitbucket.org/juspay/ec-cordova-plugin
```
or
```sh
cordova plugin add https://bitbucket.org/juspay/ec-cordova-plugin
```

## iOS Details

Before starting the payment flow in iOS, you need to set your client key in `plugin/src/ios/JPExpressCheckout.m` 

```objective-c
self.checkout = [[ExpressCheckout alloc] initWithClientKey:@"<YOUR_CLIENT_KEY>" environment:PRODUCTION];
```

## Android Details

## Starting payment flow

You are ready to start the payment as soon as your server has called JusPay API to create order. The following parameters are available to you now:

```javascript
var orderId = "<your_order_id>"
var merchantId = "<your_merchant_id>"
```

### Define Return Url Callback
When the user has completed the payment (could be success or failure), the user will be redirected to the `return_url` configured by you at the time of order creation. JusPay will invoke your function when the user has reached this `return_url`. 
```javascript
var onEndUrlReached = function () {
    // your code to check the server status
    var paymentStatus = getPaymentStatusFromServer()
    if(paymentStatus == "CHARGED") {
        gotoThankYouPage()
    }
    else {
        gotoFailurePage()
    }
};
```
**Note**: JusPay will not provide the payment status in the callback function, because it is a security issue. You will have to check with your server and retrieve the status from JusPay using `/order/status` API.
### Define back button callback
If the user presses back button, then the transaction is aborted midway by the user. Our plugin will let you know when this happens through a callback. You may define the function as:
```javascript
var abortedCallback = function () {
    gotoFailurePage()
};
```
The plugin will handle all the payment pages and when the user has completed the payment, the user is finally redirected to your website. To stop the plugin at the correct end URL, you must declare the final return URL that you have configured with JusPay.
```javascript
var endUrls = ["https://shop.com/juspay-response/.*", "https://beta.shop.com/juspay-response/.*"]
```
Once all these variables are declared correctly, you are ready to put it together and setup the payment flow:

```javascript
ExpressCheckout.startCheckoutActivity({
    "endUrls": endUrls,
    "onEndUrlReached": onEndUrlReached,
    "onTransactionAborted": onTransactionAborted,
    "environment": "PRODUCTION", // can be either of "SANDBOX" or "PRODUCTION"
    "parameters": {
        "orderId": orderId,
        "merchantId": merchantId,
    },
})
```

### Customizing the Action Bar

Juspay safe browser alllows the user to customize the action bar. To customize the acton bar, pass in a JSON configuration to the `ExpressCheckout.startCheckoutActivity` method as shown:

```javascript
ExpressCheckout.startCheckoutActivity({
    "endUrls": endUrls,
    "onEndUrlReached": onEndUrlReached,
    "onTransactionAborted": onTransactionAborted,
    "environment": "PRODUCTION", // can be either of "SANDBOX" or "PRODUCTION"
    "parameters": {
        "orderId": orderId,
        "merchantId": merchantId,
    },

    // Action bar customization options
    "actionBar": {
        "backgroundColor": "#FF0000",
        "backgroundImage": "my-drawable-resource",
        "icon": "my-drawable-resource",
        "displayNote": "Flight Mumbai <-> Delhi",
        "remarks": "Flight MUM DEL"
    }
})
```

| Option | Description |
| ------ | ----------- |
| backgroundColor | Sets the background color of the action bar, this must be a hex color code, like `#f9c7d1` |
| backgroundImage | Name of the file to be used as backgroundImage of action bar. Note that if this property and `backgroundColor` are set, `backgroundImage` will override `backgroundColor` |
| icon | Name of the file to be set as the icon image. |
| displayNote | Short note about transaction shown to the customer. ex. 'Paying INR 200 for Order 123456' |
| remarks | Remarks about transaction. This will be automatically filled up in the netbanking page. ex. 'Pay to merchant' |

**Note**: The images to be used for `icon` and `backgroundImage` must be placed in the drawables resource folder of android. See this [link](https://cordova.apache.org/docs/en/latest/config_ref/images.html#configuring-icons-in-the-cli) for more information.
## Examples

We have setup simple examples for you to see the code working end to end. Examples are provided for both Cordova & PhoneGap. Check the working examples [here](https://bitbucket.org/juspay/ec-cordova-plugin/src/HEAD/examples/?at=master).

## Help & Support

If you notice any errors or issues with the integration, please reach out to us at support@juspay.in. You may also search our [Knowledge base](http://faq.juspay.in) to see if the issue has already been addressed by our team.

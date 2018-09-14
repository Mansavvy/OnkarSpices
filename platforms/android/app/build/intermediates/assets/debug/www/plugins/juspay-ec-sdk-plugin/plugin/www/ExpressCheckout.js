cordova.define("juspay-ec-sdk-plugin.ExpressCheckout", function(require, exports, module) {
/**
 * Main module that packs the payment functionality and success / failure callbacks
 */
var expressCheckout = {
  ABORTED: 'txn-aborted'
};

Object.defineProperty(expressCheckout, 'startCheckoutActivity', {
  enumerable: false,
  value: function(configs) {
    var requiredFields = [{
      key: 'endUrls',
      validator: function (urls) {
        return 'length' in urls && urls.length > 0    ;
      }
    }, {
      key: 'onEndUrlReached',
      validator: function (f) {
        return typeof f === 'function';
      }
    }, {
      key: 'onTransactionAborted',
      validator: function (f) {
        return typeof f === 'function';
      }
    }, {
      key: 'environment',
      validator: function (env) {
        return (env === 'PRODUCTION' || env === 'SANDBOX' || env === 'LOCAL');
      }
    }, {
      key: 'parameters',
      validator: function (params) {
        var req = ['orderId', 'merchantId'];
        var isOk = true;

        for(var i in req) {
          isOk = isOk && ((req[i] in params) &&
                          (params[req[i]]));
        }
        return isOk;
      }
    }, {
      key: 'instruments',
      validator: function (instruments) {
        var isOk = true;
        for(var i in instruments) {
          var instrument = instruments[i];
          isOk = isOk && (instrument === 'WALLET' || instrument === 'CARD' || instrument === 'NB');
        }
        return isOk && instruments.length > 0;
      }
    }];

    for(var e in requiredFields) {
      var field = requiredFields[e];
      if(!(field.key in configs) || !field.validator(configs[field.key])) {
        throw "Error: Please specify the following field: " + field.key;
      }
    }

    var options = [{
      'merchantId': configs.parameters.merchantId,
      'orderId': configs.parameters.orderId,
      'environment': configs.environment,
      'endUrlRegexes': configs.endUrls,
      'instruments': configs.instruments,
      'actionBar': configs.actionBar
    }];

    var successDispatcher = function(args) {
      switch (args._method) {
      case 'endUrlReached':
        configs.onEndUrlReached(args.data);
        break;
      case 'onTransactionAborted':
        configs.onTransactionAborted(args.data);
        break;
      }
    };

    var errorDispatcher = function(args) {
      configs.error();
    };

    cordova.exec(
      successDispatcher,
      errorDispatcher,
      "ExpressCheckout",
      "JuspayStartPayment",
      options
    );
  }
});

if('freeze' in Object && typeof Object.freeze === 'function') {
  expressCheckout = Object.freeze(expressCheckout);
}

module.exports = expressCheckout;

});

//
//  JPExpressCheckout.h
//  
//
//  Created by Sachin Sharma on 30/04/16.
//
//

#import <Cordova/CDV.h>
#import <ExpressCheckout/ExpressCheckout.h>

@interface JPExpressCheckout : CDVPlugin
- (void)JuspayStartPayment:(CDVInvokedUrlCommand*)command;
@end

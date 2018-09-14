//
//  JPExpressCheckout.m
//
//
//  Created by Sachin Sharma on 30/04/16.
//
//

#import "JPExpressCheckout.h"

@interface JPExpressCheckout()

@property (nonatomic, strong) ExpressCheckout *checkout;

@end

@implementation JPExpressCheckout

- (void)dismissView {
    [self.checkout backButtonPressed];
}

-(void)JuspayStartPayment:(CDVInvokedUrlCommand*)command{

    NSString* callbackId = command.callbackId;
    NSDictionary *arguments = [[command arguments] objectAtIndex:0];
    NSString* environment = [arguments objectForKey:@"environment"];
    NSString* merchantId = [arguments objectForKey:@"merchantId"];
    NSString* orderId = [arguments objectForKey:@"orderId"];
    NSArray* instruments = [arguments objectForKey:@"instruments"];
    NSArray* endUrlRegexes = [arguments objectForKey:@"endUrlRegexes"];

    self.checkout = [[ExpressCheckout alloc] initWithClientKey:@"<CLIENT_KEY>" environment:[self.checkout environmentEnumFromString:environment]];

    if ([self.checkout respondsToSelector:@selector(environment:merchantId:orderId:instrumentOptions:endUrlRegexes:)]) {
        [self.checkout environment:[self.checkout environmentEnumFromString:environment] merchantId:merchantId orderId:orderId instrumentOptions:instruments endUrlRegexes:endUrlRegexes];
    }else{
        [self.checkout environment:[self.checkout environmentEnumFromString:environment] merchantId:merchantId orderId:orderId endUrlRegexes:endUrlRegexes];
    }

    UIViewController *juspayViewController = [[UIViewController alloc] init];
    CGRect frame = self.viewController.view.frame;
    frame.size.height -= 64;
    juspayViewController.view.frame = frame;

    UIBarButtonItem *item = [[UIBarButtonItem alloc]initWithTitle:@"Cancel" style:UIBarButtonItemStyleDone target:self action:@selector(dismissView)];
    juspayViewController.navigationItem.leftBarButtonItem = item;
    juspayViewController.edgesForExtendedLayout = UIRectEdgeNone;

    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:juspayViewController];
    [navigationController.navigationBar setTitleTextAttributes:@{NSForegroundColorAttributeName : [UIColor blackColor]}];
    navigationController.navigationBar.translucent = NO;

    [self.viewController presentViewController:navigationController animated:YES completion:nil];

    [self.checkout startPaymentInView:juspayViewController.view callback:^(Boolean status, NSError * _Nullable error, id  _Nullable info) {

        NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
        CDVPluginResult *result = nil;
        
        if (error && error.code != 101) {
            [dict setObject:error.description forKey:@"data"];
            
            result = [CDVPluginResult
                      resultWithStatus:CDVCommandStatus_ERROR
                      messageAsDictionary:dict];
        } else {
            if(status == true) {
                [dict setObject:@"endUrlReached" forKey:@"_method"];
            } else {
                [dict setObject:@"onTransactionAborted" forKey:@"_method"];
            }
            [dict setObject:info forKey:@"data"];
            
            
            result = [CDVPluginResult
                      resultWithStatus:CDVCommandStatus_OK
                      messageAsDictionary:dict];
        }
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];

    }];
}

@end

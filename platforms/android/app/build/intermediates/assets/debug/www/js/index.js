

var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('login');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'signupController'
        })
        .state('privacy-policy', {
            url: '/privacy-policy',
            templateUrl: 'templates/privacy-policy.html',
            controller: 'privacy-policyController'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'templates/main.html',
            controller: 'mainController'
        })
        .state('menu', {
            url: '/menu',
            templateUrl: 'templates/menu.html',
            controller: 'menuController'
        })
        .state('checkout', {
            url: '/checkout',
            templateUrl: 'templates/checkout.html',
            controller: 'checkOutController'
        })
        .state('confirmOrder', {
            url: '/confirmOrder',
            templateUrl: 'templates/confirmOrder.html',
            controller: 'confirmOrderController'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'templates/settings.html',
            controller: 'settingsController'
        })
        .state('appSettings', {
            url: '/appSettings',
            templateUrl: 'templates/appSettings.html',
            controller: 'appSettingsController'
        })
        .state('cart', {
            url: '/cart',
            templateUrl: 'templates/cart.html',
            controller: 'cartController'
        })
        .state('card', {
            url: '/card',
            templateUrl: 'templates/card.html',
            controller: 'foodcardController'
        })
        .state('flyer', {
            url: '/food-card',
            templateUrl: 'templates/flyer.html',
            controller: 'flyerController'
        })
        .state('recover', {
            url: '/recover',
            templateUrl: 'templates/forgot.html',
            controller: 'frogotController'
        })

});

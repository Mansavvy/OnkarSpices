angular.module('routerApp').controller('confirmOrderController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	$scope.cartPage = function(){
		$state.go('cart');
	}
}]);
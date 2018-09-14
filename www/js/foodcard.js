angular.module('routerApp').controller('foodcardController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	$('.fa-credit-card').addClass('animated bounceInLeft');
	var username = localStorage.getItem("username");
	$.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                  type: "GET",
                  contentType: "application/json",
                   success:function(data){
                          $("#cardId").val(data[0]._id.$oid);
                          $("#cardPoints").val(data[0].cardPoints);
                   }
         } );
}]);
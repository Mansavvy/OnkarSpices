angular.module('routerApp').controller('flyerController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	$(".loading").show();
	$http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/flyers-data/collections/?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        contentType: "application/json"
    }).then(function mySuccess(response) {
        $scope.flyersData = response.data;
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i] != "system.indexes") {
                $http({
                    method: "GET",
                    url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                    contentType: "application/json"
                }).then(function mySuccess(response) {
                    console.log(response.data[0].flyer_status);
                    $(".loading").hide();
                    if (response.data[0].flyer_status == "inactive") {
                        $("#statusOf" + response.data[i].flyer_name).addClass("fadeDiv");
                    }
                }, function myError(response) {
                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                });
            }
        }

    }, function myError(response) {
        $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
    });

    $scope.showFlyerData = function (flyerName) {
        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + flyerName + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            contentType: "application/json"
        }).then(function mySuccess(response) {
            $scope.viewbleFlyerData = response.data;
            $scope.flyerHeading = response.data[0].flyer_heading;
            $scope.flyerUniqueCode = response.data[0]._id.$oid;
            $scope.flyerName = response.data[0].flyer_name;
            $scope.flyerStatus = response.data[0].flyer_status;
            $scope.flyerCreationDate = response.data[0].flyer_generation_date;
            if ($scope.flyerStatus == "inactive") {
                $scope.dButton = true;
                $scope.dButton1 = false;
            } else if ($scope.flyerStatus == "active") {
                $scope.dButton = false;
                $scope.dButton1 = true;
            }
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
}]);
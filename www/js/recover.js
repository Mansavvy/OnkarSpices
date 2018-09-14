angular.module('routerApp').controller('frogotController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.loginPage = function(){
		$state.go('login');
	}
	$scope.sendSecretCode = function(){
		var name = $("#username").val();
	    if (name == "" || name == null) {

	    } else {
	        $.ajax({
	            url: "https://api.mlab.com/api/1/databases/client/collections/" + name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	            type: "GET",
	            contentType: "application/json",
	            success: function (data) {
	            	if(data[0] == undefined){
	            		alert("No user exsit with this Username !!");
	            	}else{
	            		$.ajax({
		                    url: "https://platform.clickatell.com/messages/http/send?apiKey=IdQeSiqMSumMquoX1e_RIA==&to=1" + data[0].contact + "&content=Password -5522",
		                    type: "GET",
		                    contentType: "application/json",
		                    success: function (data) {
		                    	console.log(data)
		                        $("#sec_code").removeAttr('disabled');
		                    }
		                });
	            	}
	                
	            }
	        });
	    }
	}
	$scope.newPass = function(){
		var sec_code = $("#sec_code").val();
	    if (sec_code == "5522") {
	        $("#new_pass").removeAttr('disabled');
    	}
	}
	$scope.submitPass = function(){
		$(".loading").show();
		var name = $("#username").val();
	    var new_pass = $("#new_pass").val();
	    if (new_pass != "" && new_pass != undefined && new_pass != null) {
	        console.log(new_pass)
	        $.ajax({
	            url: "https://api.mlab.com/api/1/databases/client/collections/" + name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	            type: "GET",
	            contentType: "application/json",
	            success: function (data) {
	                $.ajax({
	                    url: "https://api.mlab.com/api/1/databases/client/collections/" + name + "/" + data[0]._id.$oid + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	                    data: JSON.stringify({
	                        "$set": {
	                            "password": new_pass
	                        }
	                    }),
	                    type: "PUT",
	                    contentType: "application/json",
	                    success: function (data) {
	                        $state.go('login');
	                        $(".loading").hide();
	                    }
	                });
	            }
	        });


	    }
	}
}]);
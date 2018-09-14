angular.module('routerApp').controller('settingsController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$(".loading").show();
	$scope.mainPage = function(){
		$.ajax({
            url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
               if(data[0].user_status == "inactive"){
               		$state.go('login');
               }else{
               		$state.go('main');
               }
			    
            }
        });
		
	}
	var username = localStorage.username;
	$.ajax({
            url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                var firstname = $("#firstname").val(data[0].firstname);
				var lastname = $("#lastname").val(data[0].lastname);
			    var contact = $("#contact").val(data[0].contact);
			    var username = $("#username").val(data[0].username);
			    var password = $("#password").val(data[0].password);

			    var streetName = $("#streetName").val(data[0].streetName);
			    var housenumber = $("#housenumber").val(data[0].housenumber);
			    var city = $("#city").val(data[0].city);
			    var zip = $("#zip").val(data[0].zip);
			    $("#acctStatus").val(data[0].user_status);
			    if( data[0].user_status == "active"){
			    	$(".btn-success").hide();
			    }else{
			    	$(".btn-danger").hide();
			    }
			    $(".loading").hide();
            }
        });
	$scope.activate = function(){
		$(".loading").show();
		$.ajax({
	        url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	        data: JSON.stringify({
	            "$set": {
	                "user_status": "active",
	            }
	        }),
	        type: "PUT",
	        contentType: "application/json",
	        success: function (data) {
	        	$(".loading").hide();
	            $state.go('login');
	            
	        }
	    });
	}
	$scope.deactivate = function(){
		$(".loading").show();
		$.ajax({
	        url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	        data: JSON.stringify({
	            "$set": {
	                "user_status": "inactive",
	            }
	        }),
	        type: "PUT",
	        contentType: "application/json",
	        success: function (data) {
	        	$(".loading").hide();
	            $state.go('login');
	            
	        }
	    });
	}
	$scope.updateData = function(){
		$(".loading").show();
		var firstname = $("#firstname").val();
		var lastname = $("#lastname").val();
	    var contact = $("#contact").val();
	    var password = $("#password").val();
	    var streetName = $("#streetName").val();
	    var housenumber = $("#housenumber").val();
	    var city = $("#city").val();
	    var zip = $("#zip").val();
	    if (firstname == "" || firstname == null) {
	        $("#firstname").addClass("error");
	        $(".loading").hide();
	    } else if (contact == "" || contact == null) {
	        $("#contact").addClass("error");
	        $(".loading").hide();
	    } else if (password == "" || password == null) {
	        $("#password").addClass("error");
	        $(".loading").hide();
	    }else {
	    	$.ajax({
		        url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
		        data: JSON.stringify({
		            "$set": {
		                "firstname": firstname,
	                    "lastname": lastname,
	                    "contact": contact,
	                    "password": password,
	                    "streetName":streetName,
	                    "housenumber": housenumber,
	                    "city": city,
	                    "zip":zip,
		            }
		        }),
		        type: "PUT",
		        contentType: "application/json",
		        success: function (data) {
		        	$(".loading").hide();
		            $state.go('main');
		            
		        }
		    });
	    }
		
	}
}]);
angular.module('routerApp').controller('signupController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.login = function(){
		$state.go('login');
	}
	$scope.privacyTerms = function(){
		$(".privacyPolicy").show();
	}
	$scope.closeprivacyTerms = function(){
		$(".privacyPolicy").hide();
	}
	$scope.signup = function(){
		$(".loading").show();
		var firstname = $("#firstname").val();
		var lastname = $("#lastname").val();
	    var contact = $("#contact").val();
	    var username = $("#username").val();
	    var password = $("#password").val();

	    var streetName = $("#streetName").val();
	    var housenumber = $("#housenumber").val();
	    var city = $("#city").val();
	    var zip = $("#zip").val();
	    if (firstname == "" || firstname == null) {
	        alert("Error !!")
	        $("#firstname").addClass("error");
	        $(".loading").hide();
	    } else if (contact == "" || contact == null) {
	        alert("Error !!")
	        $("#contact").addClass("error");
	        $(".loading").hide();
	    } else if (username == "" || username == null) {
	        alert("Error !!")
	        $("#username").addClass("error");
	        $(".loading").hide();
	    }else if (password == "" || password == null || password.length < 6) {
            alert("Error !!")
            $("#password").addClass("error");
            $(".loading").hide();
        }else if (streetName == "" || streetName == null) {
             alert("Error !!")
             $("#streetName").addClass("error");
             $(".loading").hide();
         }else if (housenumber == "" || housenumber == null) {
               alert("Error !!")
               $("#housenumber").addClass("error");
               $(".loading").hide();
           }else if (city == "" || city == null) {
               alert("Error !!")
               $("#city").addClass("error");
               $(".loading").hide();
           }else if (zip == "" || zip == null) {
               alert("Error !!")
               $("#zip").addClass("error");
               $(".loading").hide();
           }
	    else {
	        $(".signup .input-group input").each(function(){
	        	$(this).removeClass("error");
	        })
	        $("#address").removeClass("error");
	        if ($("#legalPrivacy").is(':checked') == true) {
	            $.ajax({
	                url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	                data: JSON.stringify({
	                    "firstname": firstname,
	                    "lastname": lastname,
	                    "contact": contact,
	                    "username": username,
	                    "password": password,
	                    "streetName":streetName,
	                    "housenumber": housenumber,
	                    "city": city,
	                    "zip":zip,
	                    "cardPoints":0,
	                    "user_status": "active",
	                    "fcm_token" : "none",
	                    "deliveryInfo": true,
					    "cardInfo": true,
					    "flyerInfo": true
	                }),
	                type: "POST",
	                contentType: "application/json",
	                success: function (data) {
	                    $state.go('login');
	                    $(".loading").hide();
	                    alert("Account Created !!")
	                }
	            });
	        } else {
	            alert("Error !!")
	            $("#terms").addClass("error");
	            $(".loading").hide();
	        }


	    }
	}
}]);


angular.module('routerApp').controller('privacy-policyController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.signup = function(){
		$state.go('signup');
	}
}]);

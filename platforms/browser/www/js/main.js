foodItemsArray = [];
angular.module('routerApp').controller('mainController', ['$scope', '$state', '$http', function ($scope, $state, $http) {

	$(".optionBox").each(function(i) {
	    $(this).delay(100 * i).queue(function() {
	      $(this).addClass("animated bounceInLeft");
	      $(this).addClass("show");
	    })
	  })
	$scope.logout = function(){
		$state.go('login');
		localStorage.removeItem("orderItems");
	}
	$scope.cart = function(){
		$state.go('cart');
	}
	$scope.menuPage = function(){
		$state.go('menu');
	}
	$scope.settingsPage = function(){
		$state.go('settings');
	}
	$scope.appsettingsPage = function(){
    		$state.go('appSettings');
    	}
	$scope.flyerPage = function(){
		$state.go('flyer');
	}
	$scope.cardPage = function(){
		$state.go('card');
	}
	var username = localStorage.getItem("username");
	$.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                      type: "GET",
                      contentType: "application/json",
                       success:function(data){
                              var uniqueClientID = data[0]._id.$oid;
                              localStorage.setItem("uniqueClientID", uniqueClientID);
                       }
             } );
     var uniqueClientID = localStorage.getItem("uniqueClientID");

	window.FirebasePlugin.getToken(function(token) {

        $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        		  data: JSON.stringify( { "$set" : { "fcm_token" : token } } ),
        		  type: "PUT",
        		  contentType: "application/json" } );
    }, function(error) {
        alert(error);
    });


  // Verify if recognition is available
  window.plugins.speechRecognition.isRecognitionAvailable(function(available){
      if(!available){
          alert("Sorry, not available");
      }

      // Check if has permission to use the microphone
      window.plugins.speechRecognition.hasPermission(function (isGranted){
          if(isGranted){
              startRecognition();
          }else{
              // Request the permission
              window.plugins.speechRecognition.requestPermission(function (){
                  // Request accepted, start recognition
                  startRecognition();
              }, function (err){
                  alert(err);
              });
          }
      }, function(err){
          alert(err);
      });
  }, function(err){
      alert(err);
  });


}]);

function startRecognition(){
      window.plugins.speechRecognition.startListening(function(result){
          // Show results in the console
          alert(result);
      }, function(err){
          alert(err);
      }, {
          language: "en-US",
          showPopup: true
      });
  }

angular.module('routerApp').controller('menuController', ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {
	$(".loading").show().parent().addClass("overFlowHidden");
	
	$http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/stock-database/collections?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
    }).then(function mySuccess(response) {
        $scope.stockData = response.data;
		for (var i = 0; i < response.data.length; i++) {
            if (response.data[i] != "system.indexes") {
                $.ajax({
                    url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                    type: "GET",
                    contentType: "application/json",
                    success: function(data) {
                        for (var j = 0; j < data.length; j++) {
                            var img_src = data[j].product_image;
                            if (img_src == undefined || img_src == "" || img_src == null) {
                                var img_src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png";
                            }
                            var html = '<li onclick="addToOrder(this)"><img src="' + img_src + '"><span class="prod_name">' + data[j].product_name + '</span><span class="price"> $' + data[j].product_price + '</span></li>'
                            $("#menu-list").append(html);
                        
                            
                        }
                        $("#menu-list li").each(function(i) {
                        	$(this).delay(100 * i).fadeIn(500).addClass("animated bounceInLeft");
						  })
                    }
                });
            }

        }
    }, function myError(response) {
    	$(".loading").hide().parent().removeClass("overFlowHidden");
    	$state.go('main');
    });

	$scope.back = function(){
		$state.go('main');
	}
	$scope.checkOut = function(){
		localStorage.setItem("orderItems", foodItemsArray);
		console.log(foodItemsArray.length);
		if(foodItemsArray.length != 0){
			$state.go('checkout');	
		}
		
	}
		
	$timeout( function(){
		foodItemsArray = [];
		if( localStorage.orderItems != undefined){
		var string = localStorage.orderItems;
		var array = string.split(",");
        for(var i = 0 ; i < array.length ; i++){
			$("#menu-list li").each(function(){
				if($(this).find(".prod_name").text() == array[i] && $(this).find(".price").text().replace("$", "") == array[i + 1]){
					$(this).addClass("selectedItem");
					foodItemsArray.push($(this).find(".prod_name").text(),$(this).find(".price").text().replace("$", ""));	
					var price = parseFloat($(this).find(".price").text().replace("$", ""));
					var prePrice = parseFloat($(".totalPrice .orignalPrice").text().replace("$", ""));
					var orignalPrice = (price + prePrice).toFixed(2);
					$(".totalPrice .orignalPrice").html("$"+orignalPrice);
					$(".loading").hide().parent().removeClass("overFlowHidden");
				}
			})
		}
	}
		console.log(foodItemsArray);
		$(".loading").hide().parent().removeClass("overFlowHidden");
    }, 1000 );
	
	
	
}]);

function myFunction(){
  var valThis = $("#searchItem").val();
    if(valThis == ""){
        $('#menu-list > li').show();
    } else {
        $('#menu-list > li').each(function(){
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
        });
   };
}
function addToOrder(e){
	if($(e).hasClass("selectedItem")){
		$(e).removeClass("selectedItem");
		var price = parseFloat($(e).find(".price").text().replace("$", ""));
		var prePrice = parseFloat($(".totalPrice .orignalPrice").text().replace("$", ""));
		var orignalPrice = (price - prePrice).toFixed(2);
		if(orignalPrice < 0){
			var orignalPrice = orignalPrice * -1;
		}
		$(".totalPrice .orignalPrice").html("$"+orignalPrice);
		var index = foodItemsArray.indexOf($(e).find(".prod_name").text());
		if(index > -1){
			foodItemsArray.splice(index,2);
		}
		
	}
	else{
		$(e).addClass("selectedItem");	
		var price = parseFloat($(e).find(".price").text().replace("$", ""));
		var prePrice = parseFloat($(".totalPrice .orignalPrice").text().replace("$", ""));
		var orignalPrice = (price + prePrice).toFixed(2);
		$(".totalPrice .orignalPrice").html("$"+orignalPrice);
		foodItemsArray.push($(e).find(".prod_name").text(),$(e).find(".price").text().replace("$", ""));
	}
	console.log(foodItemsArray);
}

angular.module('routerApp').controller('appSettingsController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $(".loading").show().parent().addClass("overFlowHidden");
    if(localStorage.getItem("gpsPermission") == "false"){
      document.getElementById("gpsPermission").checked = false;
    }else{
      document.getElementById("gpsPermission").checked = true;
    }
    

    $scope.mainPage = function(){
        $state.go('main');
    }
    var username = localStorage.username;
    var uniqueClientID = localStorage.getItem("uniqueClientID");
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            document.getElementById("deliverInfo").checked = data[0].deliveryInfo;
            document.getElementById("foodCard").checked = data[0].cardInfo;
            document.getElementById("flyerInfo").checked = data[0].flyerInfo;
            $(".loading").hide().parent().removeClass("overFlowHidden");
        }
    });
    $scope.orderNotify = function(){
        $(".loading").show().parent().addClass("overFlowHidden");
        if($("#deliverInfo").is(':checked') == true){
           $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
             data: JSON.stringify( { "$set" : {"deliveryInfo": true } } ),
             type: "PUT",
             contentType: "application/json" } );
             $(".loading").hide().parent().removeClass("overFlowHidden");
        }else{
            $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
              data: JSON.stringify( { "$set" : {"deliveryInfo": false } } ),
              type: "PUT",
              contentType: "application/json" } );
              $(".loading").hide().parent().removeClass("overFlowHidden");
        }
    }
    $scope.cardNotify = function(){
        $(".loading").show().parent().addClass("overFlowHidden");
        if($("#foodCard").is(':checked') == true){
           $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
             data: JSON.stringify( { "$set" : {"cardInfo": true } } ),
             type: "PUT",
             contentType: "application/json" } );
             $(".loading").hide().parent().removeClass("overFlowHidden");
        }else{
            $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
              data: JSON.stringify( { "$set" : {"cardInfo": false } } ),
              type: "PUT",
              contentType: "application/json" } );
              $(".loading").hide().parent().removeClass("overFlowHidden");
        }
    }
    $scope.flyerNotify = function(){
        $(".loading").show().parent().addClass("overFlowHidden");
        if($("#flyerInfo").is(':checked') == true){
           $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
             data: JSON.stringify( { "$set" : {"flyerInfo": true } } ),
             type: "PUT",
             contentType: "application/json" } );
             $(".loading").hide().parent().removeClass("overFlowHidden");
        }else{
            $.ajax( { url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "/" + uniqueClientID + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
              data: JSON.stringify( { "$set" : {"flyerInfo": false } } ),
              type: "PUT",
              contentType: "application/json" } );
              $(".loading").hide().parent().removeClass("overFlowHidden");
        }
    }
    $scope.enableGPS = function(){
      if($("#gpsPermission").is(':checked') == true){
        localStorage.setItem("gpsPermission", true);
      }else{
        localStorage.setItem("gpsPermission", false);
      }
    }
}]);
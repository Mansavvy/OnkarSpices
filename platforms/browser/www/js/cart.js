angular.module('routerApp').controller('cartController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	$scope.refreshPage = function(){
		$("#allOrders").html("");
		var username = localStorage.username;
		$.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
        	if(data.length == 0){
        		$state.go('main');
        		$(".loading").hide();
        	}else{
        		for(var i = 0 ; i < data.length ; i++){
	            	var finalPrice = data[i].orderItems.length - 4;
	            	var html = '<li data-toggle="modal" data-target="#recieptModal" onclick="getorderData(\'' + data[i]._id.$oid + '\')">';
						html +='<span class="orderStatus">Order Name - <strong>'+data[i].orderName+'</strong></span>';
						html +='<span class="amountToBePaid">$'+data[i].orderItems[finalPrice]+'</span>';
						html +='<hr>';
						html +='Status:<span class="status">'+data[i].orderStatus+'</span>';
						if(data[i].orderStatus == "new"){
							html +='<i class="fa fa-clock-o"></i> '
						}else if(data[i].orderStatus == "confirmed"){
							html +='<i class="fa fa-check-circle-o"></i> '
						}else if(data[i].orderStatus == "depart"){
							html +='<i class="fa fa-truck"></i> '
						}else{
							html +='<i class="fa fa-check"></i> '
						}
						
						html +='</li>';
					$("#allOrders").append(html);
					$(".loading").hide();
	            }
        	}
            
        }
    });
	}
	$(".loading").show();
	$("#allOrders").html("");
	var username = localStorage.username;
	$.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
        	if(data.length == 0){
        		$state.go('main');
        		$(".loading").hide();
        	}else{
        		for(var i = 0 ; i < data.length ; i++){
	            	var finalPrice = data[i].orderItems.length - 4;
	            	var html = '<li data-toggle="modal" data-target="#recieptModal" onclick="getorderData(\'' + data[i]._id.$oid + '\')">';
						html +='<span class="orderStatus">Order Name - <strong>'+data[i].orderName+'</strong></span>';
						html +='<span class="amountToBePaid">$'+data[i].orderItems[finalPrice]+'</span>';
						html +='<hr>';
						html +='Status:<span class="status">'+data[i].orderStatus+'</span>';
						if(data[i].orderStatus == "new"){
							html +='<i class="fa fa-clock-o"></i> '
						}else if(data[i].orderStatus == "confirmed"){
							html +='<i class="fa fa-check-circle-o"></i> '
						}else if(data[i].orderStatus == "depart"){
							html +='<i class="fa fa-truck"></i> '
						}else{
							html +='<i class="fa fa-check"></i> '
						}
						
						html +='</li>';
					$("#allOrders").append(html);
					$(".loading").hide();
	            }
        	}
            
        }
    });
}]);

function getorderData(id){
	var username = localStorage.username;
	$.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + username + "/" + id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            for (var i = 0; i < data.orderItems.length; i++) {
                var html = "<tr><td>" + data.orderItems[i] + "</td>";
                html += "<td>" + data.orderItems[i + 1] + "</td>";
                html += "<td>$" + data.orderItems[i + 2] + "</td></tr>";
                $("#orderedItems").append(html);
                i++;
                i++;
            }
        }
    });
}
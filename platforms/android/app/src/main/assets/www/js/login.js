angular.module('routerApp').controller('loginController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    localStorage.setItem("gpsPermission", true);
    $scope.forgot = function () {
       $state.go('recover');
    }
    $('.mainLogo').addClass('animated rubberBand');
    if (localStorage.getItem("username") != undefined && localStorage.getItem("password") != undefined) {
        $("#username").val(localStorage.getItem("username"));
        $("#password").val(localStorage.getItem("password"));
        document.getElementById("rememberMe").checked = true;
    }
    $scope.login = function(){
        $(".loading").show().parent().addClass("overFlowHidden");
        var username = $("#username").val();
        var password = $("#password").val();
        if ($("#rememberMe").is(':checked') == true) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                type: "GET",
                contentType: "application/json",
                success: function (data) {
                    if (password == data[0].password) {
                        $(".loading").hide().parent().removeClass("overFlowHidden");
                        if(data[0].user_status == "active"){
                           $state.go('main');
                           localStorage.setItem("username", username);

                       }else{
                            $state.go('settings');
                       }
                        
                        localStorage.setItem("username", username);
                    }else{
                        $(".loading").hide();
                        alert("Wrong Password !!")
                    }
                }
            });
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                type: "GET",
                contentType: "application/json",
                success: function (data) {  
                    if (password == data[0].password) {
                        $(".loading").hide();
                        $state.go('main');
                        localStorage.setItem("username", username);
                    }else{
                        $(".loading").hide();
                        alert("Wrong Password !!")
                    }
                }
            });
        }
    }
    $scope.signup = function () {
        $state.go('signup');
    }
}]);
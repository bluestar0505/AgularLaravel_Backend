'use strict';

SimbaApp.controller('DashboardController', function ($rootScope, $scope, $http, $timeout, CustomConstantService, Auth) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        Metronic.initAjax();
        var accessToken = Auth.getToken();
        $scope.model1 = [];
        $scope.model2 = [];
        $scope.model3 = [];
        $scope.total_view = $scope.total_open = 0;
        var s_filter = {
            accessToken: accessToken
        };
        $http({
            method: 'get',
            url: "/api/analytics/year_reports",
            params: s_filter
        }).success(function (pdata) {
            if (pdata.status == "success") {
                $scope.model1 = pdata.data;
                var index = 0;
                console.log($scope.model1);
                for (var x in $scope.model1) {
                    $scope.total_view += $scope.model1[x].view;
                    $scope.total_open += $scope.model1[x].open;
                    $scope.model2[index] = $scope.model1[x].view;
                    $scope.model3[index] = $scope.model1[x].open;
                    index++;
                }
                Charts.init($scope.model1, $scope.model2, $scope.model3);
            } else {
                console.log(pdata);
            }
        }).error(function (perror) {
            console.log(perror);
            toastr['error']("Connection Problem.");
        });
    });

});
'use strict';

SimbaApp.controller('TestController', function ($rootScope, $scope, $http, $timeout, CustomConstantService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        Metronic.initAjax();

        $scope.protocalList = CustomConstantService.getProtocalList();
        $scope.postData = {};
    });

    // set sidebar closed and body solid layout mode


    $scope.submitContent = function () {

        $http({
            method: $scope.postData.c_protocal,
            url: $scope.postData.c_url,
            params: JSON.parse($scope.postData.c_params)
        }).success(function (data) {
            console.log("data=", data);
        }).error(function (error) {
            console.log("error=", error);
        });
    };
});
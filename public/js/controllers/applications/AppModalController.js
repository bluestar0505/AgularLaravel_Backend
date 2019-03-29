SimbaApp.controller('AppModalController',function($rootScope,$scope,$http,AppFactory,$location, ValidateAppInfo, CustomConstantService,SimbaCache){
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

        $scope.citem = SimbaCache.getValue("app");
        $scope.isAdsShow = false;

        $scope.platforms=CustomConstantService.getPlatforms();
        $scope.placements=CustomConstantService.getPlacements();
        $scope.mediatypes=CustomConstantService.getMediaTypes();
    });



    $scope.Save = function() {

        var param = {
            name: $scope.citem.name,
            platform: $scope.citem.platform,
            description: $scope.citem.description
        };
        var vali =ValidateAppInfo.validate(param);
        if (vali == "success") {

            var cFactory = new AppFactory(param);

            cFactory .$save(
                function success(pdata) {
                    if (pdata.status == "success") {
                        toastr['success']($rootScope._labels.alerts._saved);
                        $scope.citem = pdata.data;
                        $scope.citem.ads = [];
                        SimbaCache.setValue("app",$scope.citem);
                        if (confirm($rootScope._labels.apps.question1,"Yes","No")) {
                            $location.path("/ads/list");
                        }else {
                           $location.path("/applications");
                        }
                    }else{
                        toastr['error'](pdata.message, 'Fail');
                    }
                },
                function error(error) {
                    toastr['error']($rootScope._labels.alerts._unknown, 'Fail!');
                });

        }else{
            //alert("Error");
            toastr['error'](vali, 'Warning');
        }

    };

    $scope.Update = function() {
        if ($scope.citem == null){
            toastr['error']($rootScope._labels.apps.comment1, 'Fail');
            return;
        }
        var param = {
            id:$scope.citem.id,
            name: $scope.citem.name,
            platform: $scope.citem.platform,
            description: $scope.citem.description
        };
        var vali =ValidateAppInfo.validate(param);
        if (vali == "success") {

            var cFactory = new AppFactory(param);

            cFactory.$update({id:$scope.citem.id},
                function success(pdata) {

                    if (pdata.status == "success") {
                        toastr['success']($rootScope._labels.alerts._modified)
                        SimbaCache.setValue("app",$scope.citem);
                        if (confirm($rootScope._labels.apps.question1,["Yes","No"])) {
                            $location.path("/ads/list");
                        }else
                            $location.path("/applications");
                    }else{
                        toastr['error'](pdata.message, 'Fail');
                    }
                },
                function error(error) {
                    toastr['error']($rootScope._labels.alerts._unknown, 'Fail!');
                });

        }else{
            //alert("Error");
            toastr['error'](vali, 'Warning');
        }

    };

    $scope.Delete = function() {
        if ($scope.citem == null){
            toastr['error']($rootScope._labels.apps.comment2);
            return;
        }
        if (confirm($rootScope._labels.alerts.question1)) {
            AppFactory.delete({id: $scope.citem.id},
                function success(response) {
                    if (response.status == "success") {
                        toastr['success']($rootScope._labels.alerts._deleted);
                        $location.path("/applications");
                    }
                    else
                        toastr['error'](response.message, 'Fail');
                },
                function error(errorResponse){
                    toastr['error']($rootScope._labels.alerts._unknown);
                });
        } else {
            return;
        }
    };

    $scope.saveApp = function () {
        $scope.Save();

    };
    /*
    Action methods
     */
    $scope.updateApp = function () {
        $scope.Update();
    };
    $scope.deleteApp = function () {
        $scope.Delete();
    };
    $scope.cancelApp = function () {
        $location.path("/applications");
    };
    $scope.toAppList = function () {
        $location.path("/applications");
    }

    $scope.toAdsList = function () {
        SimbaCache.setValue("app",$scope.citem);
        $location.path("/ads/list");
        // $scope.isAdsShow = true;
    };
    $scope.toAppTokenList = function () {
        SimbaCache.setValue("app",$scope.citem);
        $location.path("/token/list");
        // $scope.isAdsShow = true;
    };
})

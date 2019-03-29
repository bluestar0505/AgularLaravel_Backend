SimbaApp.controller('AdsAloneController', function ($rootScope, $scope, $http, $location, AppFactory, AdsFactory, SimbaCache, Auth, CustomConstantService, ValidateAdsInfo) {
    $scope.adsList = [];
    $scope.capp = [];
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        $scope.placements = CustomConstantService.getPlacements();
        $scope.types = CustomConstantService.getMediaTypes();
        $scope.appList = [];
        $scope.initAppList();
        if ($scope.capp == [])
            toastr['success']($rootScope._labels.alerts.ads_sel_app, "!");
    });

    $scope.initAppList = function () {
        var appFactory = AppFactory.query(
            function success(response) {
                if (response.status == "success") {
                    $scope.appList = response.data;
                } else {
                    toastr['success']($rootScope._labels.alerts._noresult, "Help");
                }
            },
            function fail(error) {
                toastr['error']($rootScope._labels.alerts._unknown, "Failed");
            }
        );

    };


    $scope.initTableModel = function (p_id) {
        $scope.adsList = [];

        var adsFactory = AdsFactory.query({
                app_id: p_id
            },
            function success(response) {
                console.log(p_id, response);
                if (response.status == "success") {
                    $scope.adsList = response.data;
                } else {
                    if (response.message == "No Result") {
                        toastr['warning']($rootScope._labels.alerts._noresult);
                    } else
                        toastr['error']($rootScope._labels.alerts._unknown, "Failed");
                }
            },
            function fail(error) {
                toastr['error']($rootScope._labels.alerts._unknown, "Failed");
            }
        );
    };



    $scope.Save = function (p_ads) {
        /*
         File Validation
         */

        /*
         Setting Request Params
         */
        var param = {
            name: p_ads.name,
            placement: p_ads.placement,
            type: p_ads.type,
            openLink: p_ads.openLink,
            accessToken: Auth.getToken()
            // upload_file:fileList[0]
        };
        /*
         Input Validation
         */

        var vali = ValidateAdsInfo.validate(param);
        /*
         If Success Save your item
         */
        if (vali == "success") {
            var el = $('#create_container');
            var url = "api/apps/" + $scope.capp.id + "/ads";

            el.find('form').ajaxSubmit({
                url: url,
                type: 'POST',
                data: param,
                success: $scope.onSubmitResponse,
                error: function (p_error) {
                    toastr['error']($rootScope._labels.alerts._unknown, 'Fail!');
                }
            });
            $location.url("/ads_alone/list");
        } else {
            toastr['error'](vali, 'Warning');
        }
    };
    $scope.Update = function (p_ads) {
        /*
         File Validation
         */

        /*
         Setting Request Params
         */
        console.log(p_ads);
        var param = {
            name: p_ads.name,
            placement: p_ads.placement,
            type: p_ads.type,
            openLink: p_ads.openLink,
            accessToken: Auth.getToken()
            // upload_file:fileList[0]
        };
        /*
         Input Validation
         */

        var vali = ValidateAdsInfo.validate(param);
        /*
         If Success Save your item
         */

        if (vali == "success") {
            var el = $('#update_container');
            var url = "api/apps/" + $scope.capp.id + "/ads/" + p_ads.id;

            el.find('form').ajaxSubmit({
                url: url,
                type: 'POST',
                data: param,
                success: $scope.onSubmitResponse,
                error: function (p_error) {
                    toastr['error']($rootScope._labels.alerts._unknown, 'Fail!');
                }
            });
            $location.url("/ads_alone/list");
        } else {
            toastr['error'](vali, 'Warning');
        }
    };

    $scope.onSubmitResponse = function (pdata) {
        console.log(pdata);
        if (pdata.status == "success") {
            $scope.initTableModel($scope.capp.id);
            toastr['success']($rootScope._labels.alerts._saved);
        } else if (pdata.status == "fail") {
            toastr['error'](pdata.message, 'Fail');

        }
    }
    /*
     Actions
     */
    $scope.toNewAds = function () {
        SimbaCache.setValue("ads", {});
        $location.url("/ads_alone/create");
    };

    $scope.toUpdateAds = function (p_ads) {
        SimbaCache.setValue("ads", p_ads);
        $location.url("/ads_alone/update");
    }

    $scope.cancelAds = function (p_ads) {
        SimbaCache.setValue("ads", p_ads);
        $location.path("/ads_alone/list");
    }


    $scope.toAdsList = function (item) {
        $scope.capp = item;
        SimbaCache.setValue("app", $scope.capp);
        $scope.initTableModel($scope.capp.id);
        $location.path("/ads_alone/list");
    };

});
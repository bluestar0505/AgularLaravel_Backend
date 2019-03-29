SimbaApp.controller('AnalyticsController', function ($rootScope, $scope, $http, $location, SimbaCache, AppFactory, AdsFactory, TokenFactory, CustomConstantService, Auth) {

    $scope.clist = [];
    $scope.reportList = [];
    $scope.csearch = [];
    $scope.appList = [];
    $scope.adsList = [];
    $scope.tokenList = [];
    $scope.tab = true;

    ComponentsPickers.init();
    $("#sel-app").change(function (e) {
        $scope.initAdsList($scope.appList[e.val].id);
        $scope.initTokenList($scope.appList[e.val].id);
    });
    $scope.platforms = CustomConstantService.getPlatforms();
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        $scope.initAppList();
        /*
         Events
         */

    });
    $scope.initAppList = function () {
        var appFactory = AppFactory.query(
            function success(response) {
                if (response.status == "success") {
                    $scope.appList = response.data;
                } else {
                    // toastr['warning']("Sorry, you cannot get app list.","Warning");
                }
            },
            function fail(error) {
                toastr['error']($rootScope._labels.alerts._unknown);
            }
        );
    };
    $scope.initAdsList = function (p_id) {
        var adsFactory = AdsFactory.query({app_id: p_id},
            function success(response) {
                if (response.status == "success") {
                    $scope.adsList = [];
                    $scope.adsList = response.data;
                    console.log($scope.adsList);
                } else {
                    if (response.message == "No Result") {
                    }
                }
            },
            function fail(error) {
            }
        );
    }
    $scope.initTokenList = function (p_id) {
        var tokenFactory = TokenFactory.query({app_id: p_id},
            function success(response) {
                if (response.status == "success") {
                    $scope.tokenList = [];
                    $scope.tokenList = response.data;
                }
                /*else{
                 if (response.message == "No Result"){
                 toastr['warning']("Sorry, No token found.","Warning");
                 }else
                 toastr['warning'](response.message);
                 }*/
            },
            function fail(error) {
                //toastr['error']("Sorry, you cannot get token list.","Failed");
            }
        );
    }
    $scope.createModalOpen = function (p_token) {
        p_token = {};
        var modalInstance = $modal.open({
            templateUrl: 'views/tokens/create.html',
            controller: 'TokenCreateController',
            resolve: {
                citem: function () {
                    return p_token;
                },
                Save: function () {
                    return $scope.Save;
                },
                Update: function () {
                    return $scope.Update;
                }
            }
        });

    };
    $scope.updateModalOpen = function (p_token) {
        var modalInstance = $modal.open({
            templateUrl: 'views/tokens/update.html',
            controller: 'TokenUpdateController',
            resolve: {
                citem: function () {
                    return p_token;
                },
                Save: function () {
                    return $scope.Save;
                },
                Update: function () {
                    return $scope.Update;
                }
            }
        });
    }

    $scope.searchEvents = function () {
        var from, to;

        $accessToken = Auth.getToken();
        $cs = $scope.csearch;
        $appId = ($cs.app != null && $cs.app != '') ? $cs.app.id : '';
        $adsId = ($cs.ads != null && $cs.ads != '') ? $cs.ads.id : '';
        $appToken = ($cs.token != null && $cs.token != '') ? $cs.token.appToken : '';

        if ($cs.from != '') from = Date.parse(new Date($cs.from)); else from = '';
        if ($cs.to != '') to = Date.parse(new Date($cs.to).getTime()); else to = '';

        from = from / 1000;
        to = to / 100;
        var s_filter = {
            accessToken: $accessToken,
            from: from,
            to: to,
            event: $cs.event,
            appId: $appId,
            adsId: $adsId,
            search: $cs.search,
            platform: $cs.platform,
            appToken: $appToken
        };
        $scope.clist = [];
        $scope.reportList = [];
            $http({
                method: 'get',
                url: "/api/analytics/events",
                params: s_filter
            }).success(function (pdata) {
                if (pdata.status == "success") {
                    $scope.clist = pdata.data;

                } else {
                    console.log(pdata);
                }
            }).error(function (perror) {
            });

            $http({
                method: 'get',
                url: "/api/analytics/monthly_reports",
                params: s_filter
            }).success(function (pdata) {
                console.log(pdata);
                if (pdata.status == "success") {
                    tempList = pdata.data;
                    for (key in tempList){
                       temp = tempList[key];
                        for (key1 in temp){
                            item = {
                                month:key1,
                                view:temp[key1].view,
                                open:temp[key1].open
                            }
                        }
                        $scope.reportList.push(item);
                    }
                } else {
                }
            }).error(function (perror) {
            });
    };
    $scope.toEvents = function () {

       // $scope.searchEvents();
        $scope.searchEvents();
        if ($scope.tab)
            $location.path("/events/list");
        else
            $location.path("/events/monthly_reports");
    }

});

SimbaApp.controller('EventListController', function ($rootScope, $scope, SimbaCache) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        $scope.capp = SimbaCache.getValue("app");
        $scope.tab = true;
        $scope.initAppList();
        //alert($rootScope._labels.alerts.comment1);
        //   $scope.searchEvents();
    });


});

SimbaApp.controller('MonthlyReportsController', function ($rootScope, $scope, SimbaCache) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        $scope.capp = SimbaCache.getValue("app");
        $scope.tab = false;
        $scope.initAppList();
        //   $scope.searchReports();
    });


});

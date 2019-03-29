/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var SimbaApp = angular.module("SimbaApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",

    "ngResource",
    "RestAPIService",
    "SimbaUtility"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
SimbaApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });

}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
  // ...
}
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
SimbaApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
SimbaApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
SimbaApp.controller('AppController', ['$scope', '$rootScope', '$http', 'Auth', 'SimbaCache', function ($scope, $rootScope, $http, Auth, SimbaCache) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive


    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
SimbaApp.controller('HeaderController', function ($scope, Auth) {

    $scope.$on('$viewContentLoaded', function () {
        Layout.initHeader();
    });
    $scope.logout = function () {
        console.log($("_logout"));
        document.getElementById("_logout").submit();
    }
});
/* Setup Layout Part - Sidebar */
SimbaApp.controller('SidebarController', ['$scope', 'Auth', function ($scope, Auth) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });


}]);

/* Setup Layout Part - Theme Panel */
SimbaApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
SimbaApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
SimbaApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider

        // Dashboard
        .state('TestPage', {
            url: "/test",
            templateUrl: "views/temp.html",
            data: {pageTitle: 'Test Page'},
            controller: "TestController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            'js/controllers/TestController.js'
                        ]
                    });
                }]
            }
        })
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'Dashboard'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/admin/pages/css/tasks.css',

                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',


                            'js/scripts/chart.js',
                            'js/scripts/tasks.js',

                            'js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("myself", {
            url: "/myself",
            templateUrl: "views/myself/main.html",
            data: {pageTitle: 'My Account'},
            controller: "MyselfController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/admin/pages/css/profile.css',
                            'assets/admin/pages/css/tasks.css',

                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            //'assets/admin/pages/scripts/profile.js',

                            'js/controllers/MyselfController.js'
                        ]
                    });
                }]
            }
        })


        // User Management (for Admin)
        .state("user_management", {
            url: "/user_management",
            templateUrl: "views/user_management/main.html",
            data: {pageTitle: 'User Management'},
            controller: "UserManagementController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/usermanagement/UserManagementController.js'
                        ]
                    });
                }]
            }
        })

        // App Management (for Admin/User)
        .state("applications", {
            url: "/applications",
            templateUrl: "views/applications/main.html",
            data: {pageTitle: 'Applications'},
            controller: "ApplicationsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            //'assets/admin/pages/scripts/profile.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/applications/ApplicationsController.js'
                        ]
                    });
                }]
            }
        })

        .state("new application", {
            url: "/applications/create",
            templateUrl: "views/applications/template_create.html",
            data: {pageTitle: 'New Application'},
            controller: "AppModalController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            //'assets/admin/pages/scripts/profile.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/applications/AppModalController.js'
                        ]
                    });
                }]
            }
        })

        .state("edit application", {
            url: "/applications/update",
            templateUrl: "views/applications/template_update.html",
            data: {pageTitle: 'Edit Application'},
            controller: "AppModalController",
            resolve: {

                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            //'assets/admin/pages/scripts/profile.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/applications/AppModalController.js'
                        ]
                    });
                }]
            }
        })

        // Ads Management (for Admin/User) In Application
        .state("ads", {
            url: "/ads",
            templateUrl: "views/ads/main.html",
            data: {pageTitle: 'Ads'},
            controller: "AdsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {

                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/admin/pages/css/todo.css',
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/ads/AdsController.js'
                        ]
                    });
                }]
            }
        })

        .state("ads.list", {
            url: "/list",
            templateUrl: "views/ads/list.html",
            data: {pageTitle: 'Ads List'},
            controller: "AdsListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/ads/AdsListController.js'
                        ]
                    });
                }]
            }
        })

        .state("ads.create", {
            url: "/create",
            templateUrl: "views/ads/create.html",
            data: {pageTitle: 'Ads Create'},
            controller: "AdsCreateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery.form.js',
                            'js/controllers/ads/AdsCreateController.js'
                        ]
                    });
                }]
            }

        })

        .state("ads.update", {
            url: "/update",
            templateUrl: "views/ads/update.html",
            data: {pageTitle: 'Ads Update'},
            controller: "AdsUpdateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery.form.js',
                            'js/controllers/ads/AdsUpdateController.js'
                        ]
                    });
                }]
            }
        })

        // Token Management (for Admin/User) In Application
        .state("token", {
            url: "/token",
            templateUrl: "views/tokens/main.html",
            data: {pageTitle: 'App Tokens'},
            controller: "TokenController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {

                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/tokens/TokenController.js'
                        ]
                    });
                }]
            }
        })

        .state("token.list", {
            url: "/list",
            templateUrl: "views/tokens/list.html",
            data: {pageTitle: 'App Token List'},
            controller: "TokenListController"
        })

        // Ads Management (for Admin/User)
        .state("ads_alone", {
            url: "/ads_alone",
            templateUrl: "views/ads_alone/main.html",
            data: {pageTitle: 'Ads_alone'},
            controller: "AdsAloneController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {

                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/admin/pages/css/todo.css',
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'assets/global/plugins/jquery.form.js',
                            'js/scripts/datatable/datatable-model.js',
                            'js/controllers/ads/AdsAloneController.js'
                        ]
                    });
                }]
            }
        })

        .state("ads_alone.list", {
            url: "/list",
            templateUrl: "views/ads_alone/list.html",
            data: {pageTitle: 'Ads List'},
            controller: "AdsListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/ads/AdsListController.js'
                        ]
                    });
                }]
            }
        })

        .state("ads_alone.create", {
            url: "/create",
            templateUrl: "views/ads_alone/create.html",
            data: {pageTitle: 'Ads List'},
            controller: "AdsCreateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery.form.js',
                            'js/controllers/ads/AdsCreateController.js'
                        ]
                    });
                }]
            }
        })

        .state("ads_alone.update", {
            url: "/update",
            templateUrl: "views/ads_alone/update.html",
            data: {pageTitle: 'Ads List'},
            controller: "AdsUpdateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/jquery.form.js',
                            'js/controllers/ads/AdsUpdateController.js'
                        ]
                    });
                }]
            }
        })

        // Token Management (for Admin/User)
        .state("token_alone", {
            url: "/token_alone",
            templateUrl: "views/tokens_alone/main.html",
            data: {pageTitle: 'App Tokens'},
            controller: "TokenAloneController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {

                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/admin/pages/css/todo.css',
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                            //'js/scripts/datatable/datatable-model.js',
                            'assets/admin/pages/scripts/components-form-tools.js',
                            'js/controllers/tokens/TokenAloneController.js'
                        ]
                    });
                }]
            }
        })

        .state("token_alone.list", {
            url: "/list",
            templateUrl: "views/tokens_alone/list.html",
            data: {pageTitle: 'App Token List'},
            controller: "TokenListController"
        })

        .state("events", {
            url: "/events",
            templateUrl: "views/events/main.html",
            data: {pageTitle: 'Events'},
            controller: "AnalyticsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {

                    return $ocLazyLoad.load({
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                            'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            'assets/admin/pages/css/todo.css',
                            'assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',

                            'js/scripts/datatable/datatable-model.js',
                            'js/scripts/components-pickers.js',
                            'js/controllers/analytics/AnalyticsController.js'
                        ]
                    });
                }]
            }
        })

        .state("events.list", {
            url: "/list",
            templateUrl: "views/events/list.html",
            data: {pageTitle: 'Events'},
            controller: "EventListController"
        })

        .state("events.monthly_reports", {
            url: "/monthly_reports",
            templateUrl: "views/events/monthly_reports.html",
            data: {pageTitle: 'Monthly Reports'},
            controller: "MonthlyReportsController"
        })


}]);

/* Init global settings and run the app */
SimbaApp.run(["$rootScope", "settings", "$state", "$http", "Auth", "SimbaCache",  function ($rootScope, settings, $state, $http, Auth, SimbaCache) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope._labels = [];

    if ($rootScope._labels == null || $rootScope._labels.length == 0) {

        $http({
            method: 'get',
            url: "labels"
        }).success(function (pdata) {
            $rootScope._labels = pdata;
        }).error(function (pdata) {
            console.log("err", pdata);
        });
    }
    _accessToken = $("#_accessToken").val();
    Auth.setToken(_accessToken);
    // console.log(LabelFactory.query());

    // $rootScope.$state._accessToken = _accessToken;

    $http({
        method: 'get',
        url: "api/users/me",
        params: {
            accessToken: _accessToken
        }
    }).success(function (pdata) {
        if (pdata.status == "success") {
            Auth.setRole(pdata.data.role);
            $rootScope._userinfo = pdata.data;
        }
    });
    $rootScope.isAdmin = function () {
        if (Auth.getRole()== "admin") {
            return true;
        } else {
            return false;
        }
    };
    $rootScope._labels = SimbaCache.getValue('labels');
}]);

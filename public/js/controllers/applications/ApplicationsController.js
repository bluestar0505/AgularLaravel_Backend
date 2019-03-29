SimbaApp.controller('ApplicationsController', function($rootScope, $scope, $http, $timeout, $location, AppFactory, SimbaCache, $modal ) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

        $scope.clist = [];
        $scope.citem = {};

        $scope.initQTable();

    });

    $scope.initTableModel = function(){

        var appFactory= AppFactory.query(
            function success(response){
                if (response.status == "success"){
                    $scope.clist = response.data;
                    setTimeout(function() {
                        $scope._otable = DataTableModel.init();
                    },300);

                }else{
                    toastr['warning']($rootScope._labels.alerts._noresult);
                }
            },
            function fail(error){
                toastr['error']($rootScope._labels.alerts._unknown);
            }
        );

    };
    /*
    Action Methods
     */
    $scope.toNewApp = function () {
        //SimbaCache.setValue();
        SimbaCache.setValue("app",{});
        $location.path("/applications/create");

    };

    $scope.toUpdateApp = function (item) {
        SimbaCache.setValue("app",item);
        $location.path("/applications/update");

    };
    $scope.initQTable = function() {
           $scope.initTableModel();
    }
});

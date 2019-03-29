SimbaApp.controller('AdsUpdateController',function($rootScope, $scope, $location,SimbaCache ) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        $scope.cads = SimbaCache.getValue("ads");
        // $scope.capp = SimbaCache.getValue("app");
    });

    /*
     Actions
     */
    $scope.saveAds = function(){
        $scope.Update($scope.cads);
    }
});
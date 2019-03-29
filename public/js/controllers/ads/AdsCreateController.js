SimbaApp.controller('AdsCreateController',function($rootScope, $scope, $location, SimbaCache) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        $scope.cads = {};
        // $scope.capp = SimbaCache.getValue("app");
        // var fileSelector = $("#file_selector")["0"];
    });

    /*
     Actions
     */
    $scope.saveAds = function(){
        $scope.Save($scope.cads);
    }
});
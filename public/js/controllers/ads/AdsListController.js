SimbaApp.controller('AdsListController',function($rootScope, $scope, $http, $location, AdsFactory, SimbaCache) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components

        $scope.capp = SimbaCache.getValue("app");
        $scope.initTableModel($scope.capp.id);
    });



    $scope.deleteAds = function(p_ads) {
        if (p_ads == null){
            toastr['error']("Sorry, Select the ads you want to delete.", 'Fail');
            return;
        }
        if (confirm("Are you sure you want to delete this ads?")) {
            AdsFactory.delete({app_id:$scope.capp.id,ads_id:p_ads.id},
                function success(response) {
                    $scope.initTableModel($scope.capp.id);
                    if (response.status == "success") {
                        toastr['success']($rootScope._labels.alerts._deleted, 'Success');
                    }
                    else
                        toastr['error'](response.message, 'Fail');
                },
                function error(errorResponse) {
                    toastr['error']($rootScope._labels._unkown, 'Fail');
                });
        } else {
            return;
        }
    };

});
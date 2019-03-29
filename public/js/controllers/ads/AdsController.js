SimbaApp.controller('AdsController',function($rootScope, $scope, $http, $location, AdsFactory, SimbaCache, CustomConstantService, ValidateAdsInfo,Auth ) {

    $scope.clist =[];
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components       
        $scope.placements = CustomConstantService.getPlacements();
        $scope.types= CustomConstantService.getMediaTypes();
        $scope.capp = SimbaCache.getValue("app");
        
    });

    $scope.initTableModel = function(p_id){
        $scope.clist= [];

        var adsFactory= AdsFactory.query({app_id:p_id},
            function success(response){
                if (response.status == "success"){
                    $scope.clist = response.data;;
                }else{
                    if (response.message == "No Result"){
                       // toastr['warning']("Sorry, No advertisement found.","Warning");
                    }else
                        toastr['error']($rootScope._labels.alerts._noresult);
                }
            },
            function fail(error){
                toastr['error']($rootScope._labels.alerts._unkown,"Failed");
            }
        );
    };


    $scope.Save = function(p_ads) {
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
            openLink:p_ads.openLink,
            accessToken: Auth.getToken()
           // upload_file:fileList[0]
        };
        /*
        Input Validation
         */

        var vali =ValidateAdsInfo.validate(param);
        /*
        If Success Save your item
         */
        if (vali == "success") {
            var el = $('#create_container');
            var url = "api/apps/"+$scope.capp.id+"/ads";

            el.find('form').ajaxSubmit({
                url:url,
                type: 'POST',
                data: param,
                success: $scope.onSubmitResponse ,
                error: function(p_error){                  
                    toastr['error']($rootScope._labels.alerts._unkown, 'Fail!');
                }
            });
            $location.url("/ads/list");
        }else{
            toastr['error'](vali, 'Warning');
        }
    };
    $scope.Update = function(p_ads) {
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
            openLink:p_ads.openLink,
            accessToken: Auth.getToken()
           // upload_file:fileList[0]
        };
        /*
        Input Validation
         */

        var vali =ValidateAdsInfo.validate(param);
        /*
        If Success Save your item
         */
     
        if (vali == "success") {
            var el = $('#update_container');
            var url = "api/apps/"+$scope.capp.id+"/ads/"+p_ads.id;

            el.find('form').ajaxSubmit({
                url:url,
                type: 'POST',
                data: param,
                success: $scope.onSubmitResponse ,
                error: function(p_error){                  
                    toastr['error']($rootScope._labels.alerts._unkown, 'Fail!');
                }
            });
            $location.url("/ads/list");
        }else{
            toastr['error'](vali, 'Warning');
        }
    };
     
    $scope.onSubmitResponse = function(pdata){
        if (pdata.status == "success") {
            $scope.initTableModel($scope.capp.id);
            toastr['success']("Success in saving.", 'Success!');
        }else  if (pdata.status == "fail"){
            toastr['error'](pdata.message, 'Fail');
           
        }
    }
    /*
    Actions
    */
    $scope.toNewAds = function () {
        SimbaCache.setValue("ads",{});
        $location.url("/ads/create");
    };

    $scope.toUpdateAds = function(p_ads){
        SimbaCache.setValue("ads", p_ads);
        $location.url("/ads/update");
    };


});

SimbaApp.controller('TokenController',function($rootScope, $scope, $http, $modal, TokenFactory, SimbaCache, ValidateTokenInfo,Auth ) {

    $scope.clist = [];
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.capp = SimbaCache.getValue("app");

    });

    $scope.createModalOpen = function (p_token) {
        p_token = {};
        var modalInstance = $modal.open({
            templateUrl: 'views/tokens/create.html',
            controller: 'TokenCreateController',
            resolve: {
                citem: function(){ return p_token;},
                Save: function () {
                    return  $scope.Save;
                },
                Update: function () {
                    return  $scope.Update;
                }
            }
        });

    };
    $scope.updateModalOpen = function (p_token) {
        var modalInstance  = $modal.open({
            templateUrl: 'views/tokens/update.html',
            controller: 'TokenUpdateController',
            resolve: {
                citem: function () {return p_token;},
                Save: function () {
                    return  $scope.Save;
                },
                Update: function () {
                    return  $scope.Update;
                }
            }
        });
    }

    $scope.initTableModel = function(p_id){
        $scope.clist = [];
        var tokenFactory= TokenFactory.query({app_id:p_id},
            function success(response){
                if (response.status == "success"){
                    $scope.clist = response.data;
                }else{
                    if (response.message == "No Result"){
                        toastr['warning']($rootScope._labels.alerts._noresult);
                    }else
                        toastr['warning'](response.message);
                }
            },
            function fail(error){
                toastr['error']($rootScope._labels.alerts._unknown);
            }
        );
    };

    $scope.Save = function(p_token, $modalInstance) {
         /*
         File Validation
         */

        /*
        Setting Request Params
         */
        var param = {
            name: p_token.name
           // upload_file:fileList[0]
        };
        /*
        Input Validation
         */

        var vali =ValidateTokenInfo.validate(param);
        /*
        If Success Save your item
         */
        if (vali == "success") {

            var cFactory = new TokenFactory(param);
            cFactory .$save({app_id:$scope.capp.id},
                function success(pdata) {
                    if (pdata.status == "success") {
                        toastr['success']($rootScope._labels.alerts._saved);
                        p_token = [];
                        $scope.initTableModel($scope.capp.id);
                        $modalInstance.close();
                    }else{
                        toastr['error'](pdata.message, 'Fail');
                    }
                },
                function error(error) {
                    toastr['error']($rootScope._labels.alerts._unkown);
                });

        }else{
            toastr['error'](vali, 'Warning');
        }

    };
    $scope.Update = function(p_token, $modalInstance) {
         /*
         File Validation
         */

        /*
        Setting Request Params
         */
        if (p_token == null){
            toastr['error']($rootScope._labels.tokens.comment2);
            return;
        }
        var param = {
            id:p_token.id,
            name:p_token.name
        };
        var vali =ValidateTokenInfo.validate(param);
        alert(vali);
        if (vali == "success") {
            var cFactory = new TokenFactory(param);
            cFactory.$update({app_id:$scope.capp.id,token_id:p_token.id},
                function success(pdata) {

                    if (pdata.status == "success") {
                        toastr['success']($rootScope._labels.alerts._modified);
                        $scope.initTableModel($scope.capp.id);
                       $modalInstance.close();
                    }else{
                        toastr['error'](pdata.message, 'Fail');
                        console.log(pdata);
                    }
                },
                function error(error) {
                    toastr['error']($rootScope._labels.alerts._unkown);
                    console.log(error);
                });
        }else{
            toastr['error'](vali, 'Warning');
        }

    };
});

SimbaApp.controller('TokenListController',function($rootScope, $scope, $http, $location, TokenFactory, SimbaCache) {
    
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        $scope.capp = SimbaCache.getValue("app");
       // $scope.clist = [];
        $scope.initTableModel($scope.capp.id);
    });


    $scope.deleteToken = function(p_token) {
        if (p_token == null){
            toastr['error']($rootScope._labels.tokens.comment3);
            return;
        }
        if (confirm($rootScope._labels.alerts.question1)) {
            TokenFactory.delete({app_id:$scope.capp.id,token_id:p_token.id},
                function success(response) {
                    if (response.status == "success") {
                        toastr['success']($rootScope._labels.alerts._deleted);
                        $scope.initTableModel($scope.capp.id);
                    }
                    else
                        toastr['error'](response.message, 'Fail');
                },
                function error(errorResponse) {
                    toastr['error']($rootScope._labels.alerts._unknown);
                    console.log("Error:" + errorResponse);
                });
        } else {
            return;
        }
    };
   
});

SimbaApp.controller('TokenCreateController',function($rootScope, $modalInstance, $scope, citem,Save) {

        $scope.ctoken = citem;
        $scope.Save = Save;

    /*
     Actions
     */
    $scope.saveToken = function(){
        $scope.Save($scope.ctoken,  $modalInstance);
    }
    $scope.closeModal = function(){
        $modalInstance.close();
    }
});
SimbaApp.controller('TokenUpdateController',function($rootScope, $modalInstance, $scope,citem,Update ) {

        $scope.ctoken =citem;
        $scope.Update = Update;
     /*
     Actions
     */
    $scope.saveToken = function(){
        $scope.Update($scope.ctoken,  $modalInstance);
    }
    $scope.closeModal = function(){
        $modalInstance.close();
    }
});
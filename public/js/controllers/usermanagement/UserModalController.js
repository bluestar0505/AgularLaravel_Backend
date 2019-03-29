SimbaApp.controller('UserModalController',function($rootScope,$scope,$http,$modalInstance,UserFactory,roles,citem,Auth,ValidateUserInfo,callback){


    var _accessToken = Auth.getToken();

        $scope.useritem = citem;
        $scope.roles = roles;
        $scope.callback = callback;




    $scope.Save = function() {

        var param = {
            firstname: $scope.useritem.firstname,
            lastname: $scope.useritem.lastname,
            email: $scope.useritem.email,
            username: $scope.useritem.username,
            password: $scope.useritem.password,
            role: $scope.useritem.role,
            accessToken: _accessToken
        };
        var vali =ValidateUserInfo.validate(param,true);
        if (vali == "success") {

            var userFactory = new UserFactory(param);

            userFactory.$save(
                function success(pdata) {

                    if (pdata.status == "success") {
                        toastr['success']($rootScope._labels.alerts._saved);
                        $scope.callback(pdata.data);
                        $modalInstance.close();

                    }else{
                        toastr['error'](pdata.message, 'Fail');
                        console.log(pdata);
                    }
                },
                function error(error) {
                    toastr['error']($rootScope._labels.alerts._unknown);
                    console.log(error);
                });

        }else{
            //alert("Error");
            toastr['error'](vali, 'Warning');
        }

    };

    $scope.Update = function() {

        var param = {
            id:$scope.useritem.id,
            firstname: $scope.useritem.firstname,
            lastname: $scope.useritem.lastname,
            email: $scope.useritem.email,
            username: $scope.useritem.username,
            password: $scope.useritem.rpassword,
            role: $scope.useritem.role,
            accessToken: _accessToken
        };
        var vali =ValidateUserInfo.validate(param,false);
        if (vali == "success") {

            var userFactory = new UserFactory(param);

            userFactory.$update({id:$scope.useritem.id},
                function success(pdata) {

                    if (pdata.status == "success") {
                        toastr['success']($rootScope._labels.alerts._modified);
                        $scope.callback();
                        $modalInstance.close();

                    }else{
                        toastr['error'](pdata.message, 'Fail');
                        console.log(pdata);
                    }
                },
                function error(error) {
                    toastr['error']($rootScope._labels.alerts._unknown);
                    console.log(error);
                });

        }else{
            //alert("Error");
            toastr['error'](vali, 'Warning');
        }

    };

    $scope.saveItem = function () {
        $scope.Save();
//        $modalInstance.dismiss('cancel');
    };
    $scope.updateItem = function () {
        $scope.Update();
   //     $modalInstance.dismiss('cancel');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


})

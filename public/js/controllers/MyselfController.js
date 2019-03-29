'use strict';

SimbaApp.controller('MyselfController', function ($rootScope, $scope, $http, $timeout, Auth) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

        var _accessToken = Auth.getToken();

        $http({
            method: 'get',
            url: "api/users/me",
            params: {
                accessToken: _accessToken
            }
        }).success(function (pdata) {
            if (pdata.status == "success") {
                $scope.userinfo = pdata.data;
            }
        })


        $('.update-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                fullname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                address: {
                    required: true
                },
                city: {
                    required: true
                },
                country: {
                    required: true
                },

                username: {
                    required: true
                },
                password: {
                    required: false
                },
                rpassword: {
                    equalTo: "#register_password"
                },

                tnc: {
                    required: true
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function (form) {

                var param = {
                    firstname: $scope.userinfo.firstname,
                    lastname: $scope.userinfo.lastname,
                    email: $scope.userinfo.email,
                    username: $scope.userinfo.username,
                    password: $scope.userinfo.password,
                    accessToken: _accessToken

                };

                $http({
                    method: 'put',
                    url: "api/users/me",
                    params: param
                }).success(function (pdata) {

                    if (pdata.status == "success") {
                        toastr['success']("Successfully updated your profile.", 'Success!');
                        $scope.userinfo.firstname = pdata.data.firstname;
                        $scope.userinfo.lastname = pdata.data.lastname;
                        $scope.userinfo.username = pdata.data.username;
                        $scope.userinfo.email = pdata.data.email;
                        $scope.userinfo.role = pdata.data.role;
                        $scope.userinfo.accessToken = pdata.data.accessToken;
                    }
                    if (pdata.status == "fail") {
                        toastr['error'](data.message, 'Update failed!');
                    }

                });

            }
        });



        $('.update-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.update-form').validate().form()) {
                    $('.update-form').submit();
                }
                return false;
            }
        });

    });

    // set sidebar closed and body solid layout mode

});
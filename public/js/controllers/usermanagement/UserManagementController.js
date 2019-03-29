SimbaApp.controller('UserManagementController', ['$rootScope', '$scope', '$http', '$timeout', 'Auth', 'UserFactory', '$modal', function($rootScope, $scope, $http, $timeout, Auth, UserFactory, $modal ) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        //Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

        $scope.clist = [];
        $scope.citem = {};
        $scope.initQTable();


    });

    $scope.createModalOpen = function () {
        $scope.useritem = {};
        var modalInstance = $modal.open({
            templateUrl: 'views/user_management/template_create.html',
            controller: 'UserModalController',
            resolve: {
                roles: function () {
                    return ["admin","user"];
                },
                callback:  function(){
                       return function(citem){
                           $scope.createRow($scope._otable,citem);
                       };
                    }
                ,
                citem: function(){ return $scope.citem},
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load( {
                        name: 'SimbaApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'js/controllers/userManagement/UserModalController.js'
                        ]
                    });
                }]
            }
        });

    };

    $scope.setData = function(clist){
        var table = $scope._otable;
        table.fnDeleteRow(0);
        for (x=0; x< clist.length; x++){
            var temp = clist[x];
            table.fnAddData([temp['username'],temp['email'],temp['firstname'],temp['lastname'],temp['role'],'<a class="edit" href="">Edit</a><input type="hidden" value="'+temp["id"]+'"/>','<a class="delete" href="">Delete</a>']);
        }
    };

    $scope.createRow =function (oTable,temp) {
        oTable.fnAddData([temp['username'],temp['email'],temp['firstname'],temp['lastname'],temp['role'],'<a class="edit" href="">Edit</a><input type="hidden" value="'+temp["id"]+'"/>','<a class="delete" href="">Delete</a>']);

    }

    $scope.initTableModel = function() {
        var userFactory= UserFactory.query(
            function success(response){
                if (response.status == "success"){
                    $scope.setData(response.data);
                }else{
                    toastr['error']($rootScope._labels.alerts._noresult);
                }
            },
            function fail(error){
                toastr['error']($rootScope._labels.alerts._unknown);
                console.log("Error="+error);
            }
        );

        var table = $scope._otable;

        table.on('click', '.edit', function (e) {
            var oTable = $scope._otable;
            var nRow = $(this).parents('tr')[0];
            var aData = oTable.fnGetData(nRow);
            $scope.citem.username = aData[0];
            $scope.citem.email = aData[1];
            $scope.citem.firstname = aData[2];
            $scope.citem.lastname = aData[3];
            $scope.citem.role = aData[4];
            var jqInputs = $('input', nRow);
            $scope.citem.id =jqInputs[0].value;
            var modalInstance = $modal.open({
                templateUrl: 'views/user_management/template_update.html',
                controller: 'UserModalController',
                resolve: {
                    callback:  function(){
                        return function(){
                            oTable.fnUpdate( $scope.citem.username, nRow, 0, false);
                            oTable.fnUpdate( $scope.citem.email, nRow, 1, false);
                            oTable.fnUpdate( $scope.citem.firstname, nRow, 2, false);
                            oTable.fnUpdate( $scope.citem.lastname, nRow, 3, false);
                            oTable.fnUpdate( $scope.citem.role, nRow, 4, false);

                            oTable.fnDraw();
                        };
                    },
                    roles: function () {
                        return ["admin","user"];
                    },
                    citem: function(){ return $scope.citem},
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load( {
                            name: 'SimbaApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                            files: [
                                'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                                'js/controllers/userManagement/UserModalController.js'
                            ]
                        });
                    }]
                }
            });


        });
        table.on('click', '.delete', function (e) {
            e.preventDefault();
            var nRow = $(this).parents('tr')[0];
            var jqInputs = $('input', nRow);
            var pid =jqInputs[0].value;

            if (confirm("Are you sure you want to delete this user?")) {
                UserFactory.delete({id: pid},
                    function success(response) {
                        if (response.status == "success") {
                            toastr['success']($rootScope._labels.alerts._deleted);
                            $scope._otable.fnDeleteRow(nRow);
                            $scope._otable.fnDraw();
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
        });

    }


    $scope.initQTable = function() {

        $scope._otable = DataTableModel.init();
        $scope.initTableModel();

    }
}]);

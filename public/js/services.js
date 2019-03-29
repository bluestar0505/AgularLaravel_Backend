/**
 * Created by Administrator on 7/9/2016.
 */
'use strict';

angular.module('SimbaUtility', ['ngResource','SimbaUtility'])
 /*   .service('LabelFactory', function ($resource) {

        return $resource('LabelService', function LabelService($resource) {
            return $resource('/LabelPool.json');
        });
    })*/
    .service('CustomConstantService',function CustomConstantService(){
        var ret = {
            getProtocalList: function() {
                return ['get','post','put','delete'];
            },
            getPlatforms: function() {
                return ['ios','android','windows','web'];
            },
            getPlacements: function() {
                return ['top','right','bottom','left','popup','full'];
            },
            getMediaTypes: function() {
                return ['image','video','gif'];
            }
        };
        return ret;
    })
    .service('Auth',function Auth(){
        var ret = {
            setToken: function (p_token) {
                    $.cookie('accessToken',p_token);
            },
            getToken: function() {
                    return $.cookie('accessToken');
            },
            setRole: function (p_role) {
                $.cookie('role',p_role);
            },
            getRole: function() {
                return $.cookie('role');
            }
        };
        return ret;
    })
    .service('SimbaCache',function SimbaCache(){

        var ret = {
            setValue: function (p_name,p_cache) {
                $.cookie(p_name,JSON.stringify(p_cache));
            },
            getValue: function(p_name) {
                if ($.cookie(p_name) != null)
                    return JSON.parse($.cookie(p_name));
                return null;

            }
        };
        return ret;
    })
    .service('ValidateUserInfo',function ValidateUserInfo(){

        var ret = {
            validate: function (param,ispass) {

                if (param.username == null  || param.password == ''){
                    return "The Username is required!";
                }
                if (param.email == null  || param.password == ''){
                    return "The Email is required!";
                }
                if (param.firstname== null  || param.password == ''){
                    return "The First Name is required!";
                }
                if (param.lastname == null  || param.password == ''){
                    return "The Last Name is required!";
                }
                if (param.email.indexOf('@') < 1)
                { return "Correct Email is required!";}
                if (ispass && param.password == null  || param.password == ''){
                    return "The Password is required!";
                }
                return "success";
            }
        };
        return ret;
    })
    .service('ValidateAppInfo',function ValidateAppInfo(){

        var ret = {
            validate: function (param) {

                if (param.name == null  || param.name == ''){
                    return "The Name is required!";
                }
                if (param.platform == null  || param.platform == ''){
                    return "The Platform is required!";
                }

                return "success";
            }
        };
        return ret;
    })
    .service('ValidateAdsInfo',function ValidateAdsInfo(){

        var ret = {
            validate: function (param) {

                if (param.name == null  || param.name == ''){
                    return "The Name is required!";
                }
                if (param.placement == null  || param.placement == ''){
                    return "The Placement is required!";
                }
                if (param.type == null  || param.type == ''){
                    return "The Type is required!";
                }
                if (param.openLink == null  || param.openLink == ''){
                    return "The OpenLink is required!";
                }

                return "success";
            }
        };
        return ret;
    })

.service('ValidateTokenInfo',function ValidateTokenInfo(){
    var ret = {
        validate: function (param) {
            if (param.name == null || param.name == ''){
                return "The Name is required!";
            }
            return "success";
        }
    };
    return ret;
});



angular.module('RestAPIService', ['ngResource','SimbaUtility'])
    .factory('UserFactory', ['$resource','Auth',
        function ($resource,Auth) {
            return $resource('api/users/:id',{accessToken:Auth.getToken()},
                {
                    'get':{
                        method:'GET',
                        url:'api/users/:id',
                        params:{
                            id: '@id'
                        }
                    },
                    'save': {
                        method:'POST',
                        url:'api/users'
                    },
                    'query': {
                        method:'GET',
                        url:'api/users'
                    },
                    'delete': {method:'DELETE',
                        url:'api/users/:id',
                        params:{
                            id: '@id'
                        }
                    },
                    'update': {method:'PUT',
                        url:'api/users/:id',
                        params:{
                            id: '@id'
                        }
                    }
                });
        }
    ])
    .factory('AppFactory', ['$resource','Auth',
        function ($resource,Auth) {
            return $resource('api/apps/:id',{accessToken:Auth.getToken()},
                {
                    'get':{
                        method:'GET',
                        url:'api/apps/:id',
                        params:{
                            id: '@id'
                        }
                    },
                    'save': {
                        method:'POST',
                        url:'api/apps'
                    },
                    'query': {
                        method:'GET',
                        url:'api/apps'
                    },
                    'delete': {method:'DELETE',
                        url:'api/apps/:id',
                        params:{
                            id: '@id'
                        }
                    },
                    'update': {method:'PUT',
                        url:'api/apps/:id',
                        params:{
                            id: '@id'
                        }
                    }
                });
        }
    ])
    .factory('AdsFactory', ['$resource','Auth',
        function ($resource,Auth) {
            return $resource('api/apps/:app_id/ads',{accessToken:Auth.getToken()},
                {
                    'get':{
                        method:'GET',
                        url:'api/apps/:app_id/ads/:ads_id',
                        params:{
                            app_id: '@app_id',
                            ads_id: '@ads_id'
                        }
                    },
                    'save': {
                        method:'POST',
                        url:'api/apps/:app_id/ads',
                        params:{
                            app_id: '@app_id'
                        }
                    },
                    'query': {
                        method:'GET',
                        url:'api/apps/:app_id/ads',
                        params:{
                            app_id: '@app_id'
                        }
                    },
                    'delete': {method:'DELETE',
                        url:'api/apps/:app_id/ads/:ads_id',
                        params:{
                            app_id: '@app_id',
                            ads_id: '@ads_id'
                        }
                    },
                    'update': {method:'PUT',
                        url:'api/apps/:app_id/ads/:ads_id',
                        params:{
                            app_id: '@app_id',
                            ads_id: '@ads_id'
                        }
                    }
                });
        }
    ])



    .factory('TokenFactory', ['$resource','Auth',
        function ($resource,Auth) {
            return $resource('api/apps/:app_id/tokens',{accessToken:Auth.getToken()},
                {
                    'get':{
                        method:'GET',
                        url:'api/apps/:app_id/tokens/:token_id',
                        params:{
                            app_id: '@app_id',
                            ads_id: '@token_id'
                        }
                    },
                    'save': {
                        method:'POST',
                        url:'api/apps/:app_id/tokens',
                        params:{
                            app_id: '@app_id'
                        }
                    },
                    'query': {
                        method:'GET',
                        url:'api/apps/:app_id/tokens'
                    },
                    'delete': {method:'DELETE',
                        url:'api/apps/:app_id/tokens/:token_id',
                        params:{
                            app_id: '@app_id',
                            ads_id: '@token_id'
                        }
                    },
                    'update': {method:'PUT',
                        url:'api/apps/:app_id/tokens/:token_id',
                        params:{
                            app_id: '@app_id',
                            ads_id: '@token_id'
                        }
                    }
                });
        }
    ]);

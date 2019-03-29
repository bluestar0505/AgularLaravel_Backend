<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
 */

Route::get('/', function () {return view('login');});
Route::get('/labels', 'LabelController@getLabelPool');
Route::post('/file_upload', 'FileUploadController@upload');

Route::group(['prefix' => 'api'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/login', 'Api\AuthController@login');
        Route::post('/register', 'Api\AuthController@register');
        Route::post('/logout', 'Api\AuthController@logout');
    });
    Route::get('/test', 'Api\TestController@testEnv');
    Route::post('/emulate', 'Api\TestController@emulateEvents');
    Route::get('/ads', 'Api\AdsModuleController@getAdsDetail');
    Route::post('/ads/{adsId}/events', 'Api\AdsModuleController@postEvent');
});
Route::group(['middleware' => 'accesstoken'], function () {
    Route::get('/view', 'Api\AuthController@view');
    Route::group(['prefix' => 'api'], function () {
        Route::group(['prefix' => 'users'], function () {
            Route::get('/me', 'Api\UserController@getCurrentUserDetails');
            Route::put('/me', 'Api\UserController@updateCurrentUser');
        });
        Route::group(['prefix' => 'analytics'], function () {
            Route::get('/events', 'Api\AnalyticsController@getEventsList');
            Route::get('/monthly_reports', 'Api\AnalyticsController@getMonthlyReports');
            Route::get('/year_reports', 'Api\AnalyticsController@getThisYearReports');
        });
        Route::post('/apps/{app_id}/ads/{ads_id}', 'Api\AdsController@update');
    });
});

Route::resource('/api/users', 'Api\UserController');
Route::resource('/api/apps', 'Api\AppsController');
Route::resource('/api/apps.ads', 'Api\AdsController');
Route::resource('/api/apps.tokens', 'Api\TokensController');
/*
|--------------------------------------------------------------------------
|   Current User Management
|--------------------------------------------------------------------------
 */

/*
|--------------------------------------------------------------------------
|   User Management
|--------------------------------------------------------------------------
 */

//Route::group(['middleware'=>'admin'],function(){
//    Route::get('/view', 'AuthController@view');
//});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
 */

Route::group(['middleware' => ['web']], function () {
    //
});

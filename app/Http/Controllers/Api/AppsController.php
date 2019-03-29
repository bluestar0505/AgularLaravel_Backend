<?php

namespace App\Http\Controllers\Api;

use App\Models\App;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class AppsController extends BaseController
{
    public function getApps(Request $request)
    {
        return App::where('user_id', '=', $request->input('userid'))->get();
    }

    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();

        if (is_null($user)) {
            $res = [
                'status' => 'fail',
                'message' => 'Getting App Lists is failed!',
                'data' => [
                    'id' => '',
                    'name' => '',
                    'platform' => '',
                    'description' => '',
                ]];
            return $res;
        } else {
            /* if ($user->role == 'admin') {
            $userlist = User::all();
            if (count($userlist) > 0) {
            $resdata = array();
            foreach ($userlist as $useritem) {

            $appsdata = $useritem->apps()->get();

            if (count($appsdata)>0){
            $userdata = ['id' => $useritem->id,
            'username' => $useritem->username,
            'email' => $useritem->email,
            'firstname' => $useritem->firstname,
            'lastname' => $useritem->lastname
            ];
            $resdata_item = ['user' => $userdata,
            'apps' => $appsdata
            ];
            array_push($resdata, $resdata_item);
            }

            }
            $res = [
            'status' => 'success',
            'message' => 'ok!',
            'data' => $resdata
            ];
            }else{
            $res = [
            'status' => 'fail',
            'message' => 'No Results!',
            'data' => ''
            ];
            }

            } else if ($user->role == 'user') {*/
            // if ($user->role == 'admin') {
            $data = App::all();
            // }else
            //  $data = App::where('user_id', '=', $user->id)->get();
            if (count($data) > 0) {
                $resdata = array();
                foreach ($data as $item) {
                    $resdata_item = ['id' => $item->id,
                        'name' => $item->name,
                        'platform' => $item->platform,
                        'description' => $item->description,
                        'adsCount' => $item->ads()->count(),
                        'tokenCount' => $item->tokens()->count(),
                    ];
                    array_push($resdata, $resdata_item);
                }
                $res = [
                    'status' => 'success',
                    'message' => 'ok!',
                    'data' => $resdata,
                ];

            } else {
                $res = [
                    'status' => 'fail',
                    'message' => 'No Results!',
                    'data' => ''];
            }
            //}
        }
        return $res;
    }

    /**
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     * @return Response
     */
    public function store(Request $request)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();

        if (is_null($user)) {
            $res = [
                'status' => 'fail',
                'message' => 'Creating App  is failed!',
                'data' => [
                    'id' => '',
                    'name' => '',
                    'platform' => '',
                    'description' => '',
                ]];
            return $res;
        } else {

            $new_app = new App();

            $new_app->name = $request->input('name');
            $new_app->platform = $request->input('platform');
            $new_app->description = $request->input('description');
            $new_app->user_id = $user->id;

            $r_data = [

                'id' => $new_app->id,
                'name' => $new_app->name,
                'platform' => $new_app->platform,
                'description' => $new_app->description,
            ];
            $res = [
                'status' => 'fail',
                'message' => 'New app registeration is failed!',
                'data' => $r_data,
            ];

            $request->err_callback = $res;

            if ($new_app->save()) {
                $res = [
                    'status' => 'success',
                    'message' => 'ok!',
                    'data' => [
                        'id' => $new_app->id,
                        'name' => $new_app->name,
                        'platform' => $new_app->platform,
                        'description' => $new_app->description,
                    ]];
            } else {
                $res = [
                    'status' => 'fail',
                    'message' => 'Creating App  is failed!',
                    'data' => [
                        'id' => '',
                        'name' => '',
                        'platform' => '',
                        'description' => '',
                    ]];
            }

            return $res;

        }

    }

    /**
     * Display the specified resource.
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {

        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();
        $res = [
            'status' => 'fail',
            'message' => 'Unauthorized User!',
            'data' => [
                'id' => '',
                'name' => '',
                'platform' => '',
                'description' => '',
            ]];
        if (is_null($user)) {
            return $res;
        } else {
            $app = App::find($id);
            if (is_null($app)) {
                $res['message'] = 'Invalid Application.';
                return $res;
            } else {
                if ($user->role == 'user') {
                    if ($user->id != $app->user_id) {
                        $res['message'] = 'Access Denied! This application had been created by another user.';
                        return $res;
                    }
                    $app->user_id = $user->id;
                } else {

                }
                $app->name = $request->input('name');
                $app->platform = $request->input('platform');
                $app->description = $request->input('description');

                $r_data = [

                    'id' => $app->id,
                    'name' => $app->name,
                    'platform' => $app->platform,
                    'description' => $app->description,
                ];
                $res = [
                    'status' => 'fail',
                    'message' => 'New app registeration is failed!',
                    'data' => $r_data,
                ];

                $request->err_callback = $res;

                if ($app->save()) {
                    $res = [
                        'status' => 'success',
                        'message' => 'ok!',
                        'data' => [
                            'id' => $app->id,
                            'name' => $app->name,
                            'platform' => $app->platform,
                            'description' => $app->description,
                        ]];
                } else {
                    $res = [
                        'status' => 'fail',
                        'message' => 'Updating App  is failed,because of no existing id.',
                        'data' => [
                            'id' => '',
                            'name' => '',
                            'platform' => '',
                            'description' => '',
                        ]];
                }
            }

            return $res;

        }
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();
        $res = [
            'status' => 'fail',
            'message' => 'Unauthorized User!',
        ];
        if (is_null($user)) {
            return $res;
        } else {
            $app = App::find($id);
            if ($user->role == 'user') {
                if ($user->id != $app->user_id) {
                    $res->message = 'Access Denied! This application had been created by another user.';
                    return $res;
                }
            }
            $ads_list = App::find($id)->ads;
            if (!is_null($ads_list)) {
                foreach ($ads_list as $ads) {
                    $temp_filename = 'uploads' . DIRECTORY_SEPARATOR . $ads->url;
                    if (file_exists($temp_filename)) {
                        unlink($temp_filename);
                    }
                    $ads->delete();
                }
            }
            if (is_null($app)) {
                $res = [
                    'status' => 'fail',
                    'message' => 'Deleting App  is failed,because of no existing id.',
                ];
            } else {
                $app->delete();
                $res = [
                    'status' => 'success',
                    'message' => 'ok!',
                ];
            }
            return $res;

        }
    }

}

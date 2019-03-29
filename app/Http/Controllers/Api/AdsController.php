<?php

namespace App\Http\Controllers\Api;

use App\Models\Ad;
use App\Models\App;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdsController extends BaseController
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request, $app)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();

        if (is_null($user)) {
            $res = [
                'status' => 'fail',
                'message' => 'Getting Ads List failed!',
                'data' => [
                    'id' => '',
                    'name' => '',
                    'placement' => '',
                    'width' => '',
                    'height' => '',
                    'type' => '',
                    'url' => '',
                    'openLink' => '',
                    'tags' => '',
                ]];
            return $res;
        } else {
            $data = Ad::where('app_id', '=', $app)->get();

            if (count($data) > 0) {
                $resdata = array();
                foreach ($data as $item) {
                    $resdata_item = ['id' => $item->id,
                        'name' => $item->name,
                        'placement' => $item->placement,
                        'width' => $item->width,
                        'height' => $item->height,
                        'type' => $item->type,
                        'url' => 'uploads/' . $item->url,
                        'openLink' => $item->openLink,
                        'tags' => $item->tags,
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
                    'message' => 'No Result',
                    'data' => [
                        'id' => '',
                        'name' => '',
                        'placement' => '',
                        'width' => '',
                        'height' => '',
                        'type' => '',
                        'url' => '',
                        'openLink' => '',
                        'tags' => '',
                    ]];
            }
            return $res;
        }
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
    public function store(Request $request, $app)
    {
        $res = [
            'status' => 'fail',
            'message' => 'The Upload File is required!',
            'data' => [
                'id' => '',
                'name' => '',
                'placement' => '',
                'width' => '',
                'height' => '',
                'type' => '',
                'url' => '',
                'openLink' => '',
                'tags' => '',
            ]];
        if (!empty($_FILES)) {
            $accessToken = $request->input('accessToken');
            $user = User::where('accessToken', '=', $accessToken)->first();

            if (is_null($user)) {
                $res["message"] = 'Creating Ads is failed!';
                return $res;
            } else {
                $ads = new Ad();

                $ads->name = $request->input("name");
                $ads->placement = $request->input("placement");
                $ads->type = $request->input("type");

                //$ads->url = $temp_filename;
                $ads->openLink = $request->input("openLink");
                $ads->tags = $request->input("tags");
                $ads->app_id = $app;

                $r_err = null;
                if ($ads->name == null) {
                    $r_err = "The Name is required.";
                }

                if ($ads->placement == null) {
                    $r_err = "The Placement is required.";
                }

                if ($ads->type == null) {
                    $r_err = "The Type is required.";
                }

                if ($ads->openLink == null) {
                    $r_err = "The OpenLink is required.";
                }

                if ($r_err != null) {
                    $res["message"] = $r_err;
                    return $res;
                }
                $rand = Str::random(5);
                $filename = $_FILES['attach']['name'];
                $temp_filename = 'uploads' . DIRECTORY_SEPARATOR . $rand . "_" . $request->input("name") . substr($filename, strrpos($filename, '.'));
                move_uploaded_file($_FILES['attach']['tmp_name'], $temp_filename);

                $ads->url = $rand . "_" . $request->input("name") . substr($filename, strrpos($filename, '.'));
                list($width, $height) = getimagesize($temp_filename);
                $ads->width = $width;
                $ads->height = $height;

                $r_data = [
                    'id' => $ads->id,
                    'name' => $ads->name,
                    'placement' => $ads->placement,
                    'width' => $ads->width,
                    'height' => $ads->height,
                    'type' => $ads->type,
                    'url' => $ads->url,
                    'openLink' => $ads->openLink,
                    'tags' => $ads->tags,
                ];
                $res = [
                    'status' => 'fail',
                    'message' => 'Creating Ads is failed!',
                    'data' => $r_data,
                ];
                $request->err_callback = $res;

                if ($ads->save()) {
                    $res = [
                        'status' => 'success',
                        'message' => 'ok',
                        'data' => $ads];
                }
            }
            return $res;
        }
        return $res;
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
    public function update(Request $request, $app, $ads)
    {
        $res = [
            'status' => 'fail',
            'message' => 'The Upload File is required!',
            'data' => [
                'id' => $request->input("ID"),
                'name' => $request->input("name"),
                'placement' => $request->input("placement"),
                'width' => $request->input("width"),
                'height' => $request->input("height"),
                'type' => $request->input("type"),
                'url' => $request->input("url"),
                'openLink' => $request->input("openLink"),
                'tags' => '',
            ]];

        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', $accessToken)->first();

        if (true == false) {
            $res["message"] = 'Updating Ads is failed!';
            return $res;
        } else {
            $ads = App::find($app)->ads()->find($ads);

            if ($user->role == 'user') {
                if ($user->id != $app) {
                    $res['message'] = 'Access Denied! This advertisement had been created by another user.';
                    return $res;
                }
            }

            if (is_null($ads)) {
                $res['message'] = 'ads not found';
                return $res;
            } else {
                $ads->name = $request->input("name");
                $ads->placement = $request->input("placement");
                $ads->type = $request->input("type");
                $ads->openLink = $request->input("openLink");
                $ads->tags = $request->input("tags");

                $r_err = null;
                if ($ads->name == null) {
                    $r_err = "The Name is required.";
                }

                if ($ads->placement == null) {
                    $r_err = "The Placement is required.";
                }

                if ($ads->type == null) {
                    $r_err = "The Type is required.";
                }

                if ($ads->openLink == null) {
                    $r_err = "The OpenLink is required.";
                }

                if ($r_err != null) {
                    $res["message"] = $r_err;
                    return $res;
                }
                if (!empty($_FILES)) {

                    $rand = Str::random(5);
                    $temp_filename = 'uploads' . DIRECTORY_SEPARATOR . $ads->url;
                    if (file_exists($temp_filename)) {
                        unlink($temp_filename);
                    }
                    $filename = $_FILES['attach']['name'];
                    $temp_filename = 'uploads' . DIRECTORY_SEPARATOR . $rand . "_" . $request->input("name") . substr($filename, strrpos($filename, '.'));
                    move_uploaded_file($_FILES['attach']['tmp_name'], $temp_filename);

                    $ads->url = $rand . "_" . $request->input("name") . substr($filename, strrpos($filename, '.'));
                    list($width, $height) = getimagesize($temp_filename);
                    $ads->width = $width;
                    $ads->height = $height;
                }

                $r_data = [
                    'id' => $ads->id,
                    'name' => $ads->name,
                    'placement' => $ads->placement,
                    'width' => $ads->width,
                    'height' => $ads->height,
                    'type' => $ads->type,
                    'url' => $ads->url,
                    'openLink' => $ads->openLink,
                    'tags' => $ads->tags,
                ];
                $res = [
                    'status' => 'fail',
                    'message' => 'You cannot modify the Ads.',
                    'data' => $r_data,
                ];

                $request->err_callback = $res;

                if ($ads->save()) {
                    $res = [
                        'status' => 'success',
                        'message' => 'ok',
                        'data' => $r_data];
                    return $res;
                }
            }
            $res['message'] = "ads not found.";
            return $res;
        }
        return $res;
    }
    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $app, $ads)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();

        if (is_null($user)) {
            $res = [
                'status' => 'fail',
                'message' => 'Deleting Ads  is failed!',
            ];
            return $res;
        } else {
            $ads = App::find($app)->ads()->find($ads);
            if ($user->role == 'user') {
                if ($user->id != $app) {
                    $res['message'] = 'Access Denied! This advertisement had been created by another user.';
                    return $res;
                }
            }
            if (is_null($ads)) {
                $res = [
                    'status' => 'fail',
                    'message' => 'ads not found',
                ];
            } else {
                $temp_filename = 'uploads' . DIRECTORY_SEPARATOR . $ads->url;
                if (file_exists($temp_filename)) {
                    unlink($temp_filename);
                }
                if ($ads->delete()) {
                    $res = [
                        'status' => 'success',
                        'message' => 'ok!',
                    ];
                } else {
                    $res = [
                        'status' => 'fail',
                        'message' => 'Deleting Ads  is failed!',
                    ];
                }
            }
            return $res;
        }
    }
}

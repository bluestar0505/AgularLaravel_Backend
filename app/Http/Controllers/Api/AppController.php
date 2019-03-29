<?php

namespace App\Http\Controllers\Api;

use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\App;

class AppController extends BaseController
{

    public function index(Request $request)
    {

        $r_data = [

        ];
        $response = [
            'status' => 'fail',
            'message' => 'Sorry , You cannot get applications now.',
            'data' => $r_data,
        ];
        $request->err_callback = $response;

        $apps = Application::orderBy('name', 'asc')->get();

        if (isset($apps)) {
            $response = [
                'status' => 'success',
                'message' => '',
                'data' => $apps,
            ];
        } else {
            $response = [
                'status' => 'fail',
                'message' => 'No App Exist',
                'data' => $apps,
            ];
        }
        return $response;
    }

    //OK
    public function store(Request $request)
    {
        $app = new Application();
        $date = date('y-m-d h:i:s');

        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', $accessToken)->first();

        //$app->id = $request->input('name').Str::random(7);

        //return $app->id;
        $app->user_id = $user->id;
        $app->name = $request->input('name');
        $app->platform = $request->input('platform');
        $app->description = $request->input('description');

        //return $app;

        $r_data = [

            'id' => $app->id,
            'name' => $app->name,
            'platform' => $app->platform,
            'description' => $app->description,
        ];
        $response = [
            'status' => 'fail',
            'message' => 'New app registeration is failed!',
            'data' => $r_data,
        ];

        $request->err_callback = $response;

        if ($app->save()) {
            $response = [
                'status' => 'success',
                'message' => 'ok',
                'data' => $r_data,
            ];
        }
        return $response;
    }

    public function show(Request $request, $id)
    {
        $app = App::find($id);
        return $app;
    }

    public function update(Request $request, $id)
    {
        $app = Application::find($id);

        $app->name = $request->input('name');
        $app->platform = $request->input('platform');
        $app->description = $request->input('description');

        $r_data = [
            'id' => $app->id,
            'name' => $app->name,
            'platform' => $app->platform,
            'description' => $app->description,
        ];
        $response = [
            'status' => 'fail',
            'message' => 'App update is failed!',
            'data' => $r_data,
        ];

        $request->err_callback = $response;

        if ($app->save()) {
            $response = [
                'status' => 'success',
                'message' => 'ok',
                'data' => $r_data,
            ];
        }
        return $response;
    }

    //
    public function destroy($id)
    {

        if (Application::find($id)->delete()) {
            return ['status' => 'success', 'message' => ''];
        } else {
            return ['status' => 'fail', 'message' => 'Sorry, You cannot delete this app.'];
        }

    }

}

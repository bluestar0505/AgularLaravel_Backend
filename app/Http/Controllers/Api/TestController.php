<?php

namespace App\Http\Controllers\Api;

use App\Models\Ad;
use App\Models\App;
use App\Models\Event;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class TestController extends BaseController
{

    public function testApiSuccess(Request $request)
    {

        $response = [
            'status' => 'success',
            'message' => 'Ok!',
            'data' => [
                'id' => "test_id",
                'username' => "test_name",
                'email' => "test_email",
                'firstName' => "test_firstName",
                'lastName' => "test_lastName",
                'role' => "test_role",
                'accessToken' => "test_accessToken",
            ],
        ];

        return response()->json($request);
    }

    public function testApiFail(Request $request)
    {

        $response = [
            'status' => 'fail',
            'message' => 'Registering your details is failed!',
            'data' => [
                'id' => "test_id",
                'username' => "test_name",
                'email' => "test_email",
                'firstName' => "test_firstName",
                'lastName' => "test_lastName",
                'role' => "test_role",
                'accessToken' => "test_accessToken",
            ],
        ];

        return response()->json($response);
    }

    public function emulateEvents(Request $request)
    {

        $from = strtotime(date("2010-3-4"));
        $to = strtotime(date("Y-m-d"));
        $response = $from . "," . $to;
        $ad_list = Ad::all();
        $events = ['view', 'view', 'open', 'view', 'view', 'open', 'view'];
        $index = 0;

        if (!is_null($ad_list)) {
            foreach ($ad_list as $ads) {
                if (!is_null($ads->app->tokens)) {
                    for ($i = 0; $i < rand(70, 160); $i++) {
                        $event = new Event();
                        $event->appToken = $ads->app->tokens[0]->token;
                        $event->app_id = $ads->app->id;
                        $event->ads_id = $ads->id;
                        $event->event = $events[rand(0, 6)];
                        $event->timestamp = date("Y-m-d h:i:s", rand($from, $to));
                        if ($event->saveOrFail()) {
                            $index++;
                        }

                    }
                }
            }

        }
        return $index;
    }

    public function testEnv(Request $request)
    {
        $composer = json_decode(file_get_contents(base_path('LabelPool.json')), true);
        return $composer;
    }
}

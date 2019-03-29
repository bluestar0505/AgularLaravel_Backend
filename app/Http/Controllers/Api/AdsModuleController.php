<?php

namespace App\Http\Controllers\Api;

use App\Models\App;
use App\Models\Event;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class AdsModuleController extends BaseController
{

    public function getAdsDetail(Request $request)
    {
        function getRandomAds($adslist)
        {
            $count = count($adslist);
            $sel_index = rand(0, $count - 1);
            $resdata = $adslist[$sel_index];
            $res = [
                'status' => 'success',
                'message' => 'ok!',
                'data' => $resdata,
            ];
            return $res;
        }

        $appToken = $request->input('appToken');
        $token = Token::where('token', '=', $appToken)->first();
        if (is_null($token)) {
            $res = [
                'status' => 'fail',
                'message' => 'Getting Ads Detail is failed,because of no existing appToken',
                'data' => '',
            ];
            return $res;
        }

        $app_id = $request->input('appId');
        $app = App::find($app_id);
        if (is_null($app)) {
            $res = [
                'status' => 'fail',
                'message' => 'Getting Ads Detail is failed,because of no existing appId',
                'data' => '',
            ];
            return $res;
        }

        $m_token = $app->tokens()->where('token', '=', $appToken)->first();
        if (is_null($m_token)) {
            $res = [
                'status' => 'fail',
                'message' => 'No application specified by appId & appToken',
                'data' => '',
            ];
            return $res;
        }

        $filters = $request->input('filters');

        $width = $filters->width;
        $height = $filters->height;
        $placement = $filters->placement;
        //$tag = $filters->tag;            //reserved for future

        $adslist = $app->ads()->where('width', '=', $width)
            ->where('height', '=', $height)
            ->where('placement', '=', $placement)
            ->get();
        if (is_null($adslist)) {
            $res = [
                'status' => 'fail',
                'message' => 'No ads specified by appId & appToken',
                'data' => '',
            ];
            return $res;
        }

        if (count($adslist) > 0) {
            return getRandomAds($adslist);
        } else {
            $adslist = $app->ads()->where('width', '=', $width)
                ->where('height', '=', $height)
                ->get();
            if (count($adslist) > 0) {
                return getRandomAds($adslist);
            } else {
                $adslist = $app->ads()->where('width', '=', $width)
                    ->where('placement', '=', $placement)
                    ->get();
                if (count($adslist) > 0) {
                    return getRandomAds($adslist);
                } else {
                    $adslist = $app->ads()->where('height', '=', $height)
                        ->where('placement', '=', $placement)
                        ->get();
                    if (count($adslist) > 0) {
                        return getRandomAds($adslist);
                    } else {
                        $adslist = $app->ads()->where('width', '=', $width)
                            ->orWhere('height', '=', $height)
                            ->orWhere('placement', '=', $placement)
                            ->get();
                        if (count($adslist) > 0) {
                            return getRandomAds($adslist);
                        } else {
                            $res = [
                                'status' => 'fail',
                                'message' => 'No Results!',
                                'data' => '',
                            ];
                            return $res;
                        }
                    }
                }

            }

        }
    }

    public function postEvent(Request $request, $ads_id)
    {
        $appToken = $request->input('appToken');
        $token = Token::where('token', '=', $appToken)->first();
        if (is_null($token)) {
            $res = [
                'status' => 'fail',
                'message' => 'No application token specified by appToken',
            ];
            return $res;
        }

        $app_id = $request->input('appId');
        $app = App::find($app_id);
        if (is_null($app)) {
            $res = [
                'status' => 'fail',
                'message' => 'No application specified by app_id',
            ];
            return $res;
        }

        $m_token = $app->tokens()->where('token', '=', $appToken)->first();
        if (is_null($m_token)) {
            $res = [
                'status' => 'fail',
                'message' => 'No application specified by app_id & appToken',
            ];
            return $res;
        }

        $ads = $app->ads()->find($ads_id);

        if (is_null($ads) || count($ads) == 0) {
            $res = [
                'status' => 'fail',
                'message' => 'No ads specified by app_id & ads_id',
            ];
            return $res;
        }

        $event = new Event();
        $event->app_id = $app_id;
        $event->appToken = $appToken;
        $event->ads_id = $ads_id;
        $event->event = $request->input('event');
        $event->timestamp = $request->input('timestamp');
        //$eventData->attributes = $request->input('attributes');           //reserved for future

        $event->saveOrFail();

        $res = [
            'status' => 'success',
            'message' => 'ok',
        ];
        return $res;

    }

}

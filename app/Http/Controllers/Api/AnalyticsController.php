<?php

namespace App\Http\Controllers\Api;

use App\Models\App;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class AnalyticsController extends BaseController
{

    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function getEventsList(Request $request)
    {

        $accessToken = $request->input("accessToken");
        $from = $request->input("from");
        $to = $request->input("to");
        $event = $request->input("event");
        $app_id = $request->input("appId");
        $ads_id = $request->input("adsId");
        $search = $request->input("search");
        $platform = $request->input("platform");
        $appToken = $request->input("appToken");

        $user = User::where('accessToken', '=', $accessToken)->first();

        if (is_null($user)) {
            $res = ['status' => 'fail', 'message' => 'Getting Events List is failed!', 'data' => ''];
        } else {

            if (is_null($from) || $from == '' || $from == 'NaN') {
                $from = date('1990-1-1 0:0:0');
            } else {
                $from = date('Y-m-d h:m:s', $from);
            }

            if (is_null($to) || $to == '' || $to == 'NaN') {
                $to = date('Y-m-d h:m:s');
            } else {
                $to = date('Y-m-d h:m:s', $to);
            }

            $query = "select events.id as id, events.app_id as app_id, apps.name as app_name, ads.name as ads_name, tokens.name as appToken, events.event as event, events.timestamp as timestamp from events " .
                " left join (apps, ads, tokens) on (apps.id = events.app_id AND ads.id = events.ads_id AND tokens.app_id = events.app_id)  where events.timestamp between '" . $from . "'  and '" . $to . "'";

            if (!is_null($app_id) && $app_id != '') {
                $query .= " and events.app_id = '" . $app_id . "' ";
            }

            if (!is_null($ads_id) && $ads_id != '') {
                $query .= " and events.ads_id = '" . $ads_id . "' ";
            }

            if (!is_null($appToken) && $appToken != '') {
                $query .= " and events.appToken = '" . $appToken . "' ";
            }

            if (!is_null($event) && $event != '') {
                $query .= " and events.event= '" . $event . "' ";
            }

            if (!is_null($platform) && $platform != '') {
                $query .= " and apps.platform = '" . $platform . "' ";
            }

            if (!is_null($search) && $search != '') {
                $query .= " and (apps.name like '%" . $search . "%' or ads.name like '%" . $search . "%' or tokens.name like '%" . $search . "%')";
            }
            //return $query;

            $resdata = DB::select($query);
            if (count($resdata) > 0) {
                $res = [
                    'status' => 'success',
                    'message' => 'ok!',
                    'data' => $resdata,
                ];
            } else {
                $res = [
                    'status' => 'fail',
                    'message' => 'No Results.',
                    'data' => '',
                ];
            }

            return $res;
        }

    }

    public function getMonthlyReports(Request $request)
    {
        function getYMD($_timestamp, $_cond)
        {
            $_date = getdate($_timestamp);
            if ($_cond == 'year') {
                return $_date['year'];
            } else if ($_cond == 'month') {
                return $_date['mon'];
            } else if ($_cond == 'day') {
                return $_date['mday'];
            }

            return 0;
        }

        $accessToken = $request->input("accessToken");
        $from = $request->input("from");
        $to = $request->input("to");
        $event = $request->input("event");
        $app_id = $request->input("appId");
        $ads_id = $request->input("adsId");
        $search = $request->input("search");
        $platform = $request->input("platform");
        $appToken = $request->input("appToken");

        if (is_null($from) || $from == '' || $from == 'NaN') {
            $from = date('1990-1-1');
        } else {
            $from = date('Y-m-d', $from);
        }

        if (is_null($to) || $to == '' || $to == 'NaN') {
            $to = date('Y-m-d');
        } else {
            $to = date('Y-m-d', $to);
        }

        $user = User::where('accessToken', '=', $accessToken)->first();
        if (is_null($user)) {
            $res = ['status' => 'fail', 'message' => 'Getting Reports is failed!', 'data' => ''];
            return $res;
        } else {
            $_from_to_lists = array();

            $fromdate = $from = strtotime($from);
            $to = strtotime($to);

            for ($i = $from; $i <= $to; $i += 86400) {
                if (getYMD($fromdate, "year") == getYMD($i, "year")) {
                    if (getYMD($fromdate, "month") < getYMD($i, "month")) {
                        $_from_to = ['from' => getYMD($fromdate, "year") . "-" . getYMD($fromdate, "month") . "-" . getYMD($fromdate, "day"),
                            'to' => getYMD($i - 86400, "year") . "-" . getYMD($i - 86400, "month") . "-" . getYMD($i - 86400, "day"),
                            'fromto_string' => getYMD($fromdate, "month") . "/" . getYMD($fromdate, "year")];
                        array_push($_from_to_lists, $_from_to);
                        $fromdate = $i;
                    } else if ((getYMD($fromdate, "month") == getYMD($to, "month")) && (getYMD($i, "year") == getYMD($to, "year"))) {
                        $_from_to = ['from' => getYMD($fromdate, "year") . "-" . getYMD($fromdate, "month") . "-" . getYMD($fromdate, "day"),
                            'to' => getYMD($to, "year") . "-" . getYMD($to, "month") . "-" . getYMD($to, "day"),
                            'fromto_string' => getYMD($fromdate, "month") . "/" . getYMD($fromdate, "year")];
                        array_push($_from_to_lists, $_from_to);
                        break;
                    }
                } else if (getYMD($fromdate, "year") < getYMD($i, "year")) {
                    $_from_to = ['from' => getYMD($fromdate, "year") . "-" . getYMD($fromdate, "month") . "-" . getYMD($fromdate, "day"),
                        'to' => getYMD($i - 86400, "year") . "-" . getYMD($i - 86400, "month") . "-" . getYMD($i - 86400, "day"),
                        'fromto_string' => getYMD($fromdate, "month") . "/" . getYMD($fromdate, "year")];
                    array_push($_from_to_lists, $_from_to);
                    $fromdate = $i;
                }

            }
            if (count($_from_to_lists) == 0) {
                $res = [
                    'status' => 'fail',
                    'message' => 'No from to',
                    'data' => '',
                ];
                return $res;
            }
            $resdata = array();
            for ($i = 0; $i < count($_from_to_lists); $i++) {
                $from_item = $_from_to_lists[$i]['from'];
                $to_item = $_from_to_lists[$i]['to'];
                $fromto_string_item = $_from_to_lists[$i]['fromto_string'];

                $query = "select events.id as id, events.app_id as app_id, apps.name as app_name, ads.name as ads_name, tokens.name as appToken, events.event as event, events.timestamp as timestamp from events " .
                    " left join (apps, ads, tokens) on (apps.id = events.app_id AND ads.id = events.ads_id AND tokens.app_id = events.app_id)  where events.timestamp between '" . $from_item . "'  and '" . $to_item . "' and events.event= 'view' ";

                if (!is_null($app_id) && $app_id != '') {
                    $query .= " and events.app_id = '" . $app_id . "' ";
                }

                if (!is_null($ads_id) && $ads_id != '') {
                    $query .= " and events.ads_id = '" . $ads_id . "' ";
                }

                if (!is_null($appToken) && $appToken != '') {
                    $query .= " and events.appToken = '" . $appToken . "' ";
                }

                if (!is_null($platform) && $platform != '') {
                    $query .= " and apps.platform = '" . $platform . "' ";
                }

                if (!is_null($search) && $search != '') {
                    $query .= "  and (apps.name like '%" . $search . "%' or ads.name like '%" . $search . "%' or tokens.name like '%" . $search . "%')";
                }
                $view_data = DB::select($query);

                $query = "select events.id as id, events.app_id as app_id, apps.name as app_name, ads.name as ads_name, tokens.name as appToken, events.event as event, events.timestamp as timestamp from events " .
                    " left join (apps, ads, tokens) on (apps.id = events.app_id AND ads.id = events.ads_id AND tokens.app_id = events.app_id)  where events.timestamp between '" . $from_item . "'  and '" . $to_item . "'   and events.event= 'open' ";

                if (!is_null($app_id) && $app_id != '') {
                    $query .= " and events.app_id = '" . $app_id . "' ";
                }

                if (!is_null($ads_id) && $ads_id != '') {
                    $query .= " and events.ads_id = '" . $ads_id . "' ";
                }

                if (!is_null($appToken) && $appToken != '') {
                    $query .= " and events.appToken = '" . $appToken . "' ";
                }

                if (!is_null($platform) && $platform != '') {
                    $query .= " and apps.platform = '" . $platform . "' ";
                }

                if (!is_null($search) && $search != '') {
                    $query .= " and (apps.name like '%" . $search . "%' or ads.name like '%" . $search . "%' or tokens.name like '%" . $search . "%')";
                }
                $open_data = DB::select($query);

                if ($event == '') {
                    $resdata_item = [$fromto_string_item => ['view' => count($view_data), 'open' => count($open_data)]];
                    array_push($resdata, $resdata_item);
                } else if ($event == 'view') {
                    $resdata_item = [$fromto_string_item => ['view' => count($view_data), 'open' => '0']];
                    array_push($resdata, $resdata_item);
                } else if ($event == 'open') {
                    $resdata_item = [$fromto_string_item => ['view' => '0', 'open' => count($open_data)]];
                    array_push($resdata, $resdata_item);
                }

            }
            $res = [
                'status' => 'success',
                'message' => 'ok!',
                'data' => $resdata,
            ];
            return $res;
        }
    }

    public function getThisYearReports(Request $request)
    {
        function getYMD($_timestamp, $_cond)
        {
            $_date = getdate($_timestamp);
            if ($_cond == 'year') {
                return $_date['year'];
            } else if ($_cond == 'month') {
                return $_date['mon'];
            } else if ($_cond == 'day') {
                return $_date['mday'];
            }

            return 0;
        }

        $accessToken = $request->input("accessToken");

        $to = date('Y-m-d');
        $from = date(getYMD(strtotime($to), "year") . '-1-1');

        $user = User::where('accessToken', '=', $accessToken)->first();
        if (is_null($user)) {
            $res = ['status' => 'fail', 'message' => 'Unauthorized User!', 'data' => ''];
            return $res;
        } else {
            $_from_to_lists = array();

            $fromdate = $from = strtotime($from);
            $to = strtotime($to);

            // return $fromdate;

            for ($i = $from; $i <= $to; $i += 86400) {
                if (getYMD($fromdate, "year") == getYMD($i, "year")) {
                    if (getYMD($fromdate, "month") < getYMD($i, "month")) {
                        $_from_to = ['from' => getYMD($fromdate, "year") . "-" . getYMD($fromdate, "month") . "-" . getYMD($fromdate, "day"),
                            'to' => getYMD($i - 86400, "year") . "-" . getYMD($i - 86400, "month") . "-" . getYMD($i - 86400, "day"),
                            'fromto_string' => getYMD($fromdate, "month") . "/" . getYMD($fromdate, "year")];
                        array_push($_from_to_lists, $_from_to);
                        $fromdate = $i;
                    } else if ((getYMD($fromdate, "month") == getYMD($to, "month")) && (getYMD($i, "year") == getYMD($to, "year"))) {
                        $_from_to = ['from' => getYMD($fromdate, "year") . "-" . getYMD($fromdate, "month") . "-" . getYMD($fromdate, "day"),
                            'to' => getYMD($to, "year") . "-" . getYMD($to, "month") . "-" . getYMD($to, "day"),
                            'fromto_string' => getYMD($fromdate, "month") . "/" . getYMD($fromdate, "year")];
                        array_push($_from_to_lists, $_from_to);
                        break;
                    }
                } else if (getYMD($fromdate, "year") < getYMD($i, "year")) {
                    $_from_to = ['from' => getYMD($fromdate, "year") . "-" . getYMD($fromdate, "month") . "-" . getYMD($fromdate, "day"),
                        'to' => getYMD($i - 86400, "year") . "-" . getYMD($i - 86400, "month") . "-" . getYMD($i - 86400, "day"),
                        'fromto_string' => getYMD($fromdate, "month") . "/" . getYMD($fromdate, "year")];
                    array_push($_from_to_lists, $_from_to);
                    $fromdate = $i;
                }

            }
            if (count($_from_to_lists) == 0) {
                $res = [
                    'status' => 'fail',
                    'message' => 'No from to',
                    'data' => '',
                ];
                return $res;
            }
            $resdata = array();
            for ($i = 0; $i < count($_from_to_lists); $i++) {
                $from_item = $_from_to_lists[$i]['from'];
                $to_item = $_from_to_lists[$i]['to'];
                $fromto_string_item = $_from_to_lists[$i]['fromto_string'];

                $query = "select events.id as id, events.app_id as app_id, apps.name as app_name, ads.name as ads_name, tokens.name as appToken, events.event as event, events.timestamp as timestamp from events " .
                    " left join (apps, ads, tokens) on (apps.id = events.app_id AND ads.id = events.ads_id AND tokens.app_id = events.app_id)  where events.timestamp between '" . $from_item . "'  and '" . $to_item . "' and events.event= 'view' ";
                $view_data = DB::select($query);
                $query = "select events.id as id, events.app_id as app_id, apps.name as app_name, ads.name as ads_name, tokens.name as appToken, events.event as event, events.timestamp as timestamp from events " .
                    " left join (apps, ads, tokens) on (apps.id = events.app_id AND ads.id = events.ads_id AND tokens.app_id = events.app_id)  where events.timestamp between '" . $from_item . "'  and '" . $to_item . "'   and events.event= 'open' ";
                $open_data = DB::select($query);
                $resdata_item = [
                    "month" => $fromto_string_item,
                    'view' => count($view_data),
                    'open' => count($open_data)];
                array_push($resdata, $resdata_item);
            }
            $res = [
                'status' => 'success',
                'message' => 'ok!',
                'data' => $resdata,
            ];
            return $res;
        }
    }

}

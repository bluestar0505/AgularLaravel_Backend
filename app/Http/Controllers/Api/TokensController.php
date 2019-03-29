<?php

namespace App\Http\Controllers\Api;

use App\Models\App;
use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Str;

class TokensController extends BaseController
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
                'message' => 'Getting Token Lists is failed!',
                'data' => '',
            ];
            return $res;
        } else {
            /*$logfile = fopen("c:\debug.txt","a+");
            fwrite($logfile,"====================get= in============".$app);
            fclose($logfile);*/

            $data = Token::where('app_id', '=', $app)->get();

            if (count($data) > 0) {
                $resdata = array();
                foreach ($data as $token) {
                    $resdata_item = [
                        'id' => $token->id,
                        'token' => $token->token,
                        'name' => $token->name,
                        'issuer' => $token->issuer->id,
                        'issuer_name' => $token->issuer->username,
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
                    'data' => '',
                ];
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

        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();
        $res = [
            'status' => 'fail',
            'message' => 'Creating Application Token is failed!',
            'data' => [
                'id' => '',
                'token' => '',
                'name' => $request->input('name'),
                'issuer' => '',
                'issuer_name' => '',
            ],
        ];
        if (is_null($user)) {
            $res['message'] = 'Unauthorized user.';
            return $res;
        } else {
            if ($user->role == 'user') {
                $iapp = App::find($app);
                if ($user->id != $iapp->user->id) {
                    $res['message'] = 'Acess Denied! This application had been created by another user.';
                    return $res;
                }
            }

            $token = new Token();
            $token->name = $request->input('name');
            $token->token = $request->input('name') . "%&" . Str::random(20);
            $token->issuer_id = $user->id;
            $token->app_id = $app;

            $token->save();
            $res = [
                'status' => 'success',
                'message' => 'ok',
                'data' => [
                    'id' => $token->id,
                    'token' => $token->token,
                    'name' => $token->name,
                    'issuer' => $token->issuer->id,
                    'issuer_name' => $token->issuer->username,
                ]];

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
    public function update(Request $request, $app_id, $token_id)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();
        $res = [
            'status' => 'fail',
            'message' => 'Updating Application Token is failed!',
            'data' => '',
        ];
        if (is_null($user)) {
            return $res;
        } else {
            $temp1 = App::find($app_id)->All();
            $temp2 = App::find($app_id)->tokens;
            $token = App::find($app_id)->tokens()->find($token_id)->first();

            if ($user->role == 'user') {
                if ($user->id != $token->issuer->id) {
                    $res['message'] = 'Access Denied! This token had been created by another user.';
                    return $res;
                }
            }
            if (is_null($token)) {
                $res['message'] = 'app tokens not found.';
                return $res;
            } else {
                $token->name = $request->input('name');
                $token->token = $request->input('name') . "%&" . Str::random(20);
                $token->issuer_id = $user->id;

                $token->save();
                $res = [
                    'status' => 'success',
                    'message' => 'ok',
                    'data' => [
                        'token' => $token->token,
                        'name' => $token->name,
                        'issuer' => $token->issuer->id,
                        'issuer_name' => $token->issuer->username,
                    ]];
            }

            return $res;

        }
    }
    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $app, $token)
    {
        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();

        if (is_null($user)) {
            $res = [
                'status' => 'fail',
                'message' => 'Deleting Application Token  is failed!',
            ];
            return $res;
        } else {
            $token = App::find($app)->tokens()->find($token);

            if ($user->role == 'user') {
                if ($user->id != $token->issuer->id) {
                    $res = [
                        'status' => 'fail',
                        'message' => 'Access Denied! This token had been created by another user.',
                    ];
                    return $res;
                }
            }

            if (is_null($token)) {
                $res = [
                    'status' => 'fail',
                    'message' => 'app tokens not found',
                ];
            } else {
                $token->delete();
                $res = [
                    'status' => 'success',
                    'message' => 'ok!',
                ];
            }
            return $res;

        }
    }

}

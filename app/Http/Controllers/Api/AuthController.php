<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Str;

class AuthController extends BaseController
{
    public function login(Request $request)
    {

        $username = $request->input('username');
        $password = $request->input('password');

        $secret = array('username' => $username, 'password' => $password);

        if (Auth::attempt($secret, false)) {
            $user = User::where('username', $username)->first();
            $res = [
                'status' => 'success',
                'message' => '',
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'firstName' => $user->firstname,
                    'lastName' => $user->lastname,
                    'role' => $user->role,
                    'accessToken' => $user->accessToken,
                ]];
            return $res;
        } else {
            $user = User::where('username', $username)->first();
            $msg = "";
            if (is_null($user)) {
                $msg = "Invalid username!";
            } else {
                $msg = "Invalid password!";
            }

            $res = [
                'status' => 'fail',
                'message' => $msg,
                'data' => [
                    'id' => '',
                    'username' => $username,
                    'email' => '',
                    'firstName' => '',
                    'lastName' => '',
                    'role' => '',
                    'accessToken' => '',
                ]];
            return $res;
        }

    }
    public function register(Request $request)
    {

        $users_table = new User();
        $date = date('y-m-d h:i:s');

        //$users_table->id = $request->input('email')."simba".Str::random(5);
        $users_table->username = $request->input('username');
        $users_table->password = bcrypt($request->input('password'));
        $users_table->firstname = $request->input('firstName');
        $users_table->lastname = $request->input('lastName');
        $users_table->email = $request->input('email');
        $users_table->role = 'user';
        $users_table->created_at = date("Y-m-d h:m:s");
        $users_table->updated_at = date("Y-m-d h:m:s");
        $users_table->accessToken = Str::random(60);

        $request->err_callback = [
            'status' => 'fail',
            'message' => 'Registering your details is failed!',
            'data' => [
                'id' => $users_table->id,
                'username' => $users_table->username,
                'email' => $users_table->email,
                'firstName' => $users_table->firstname,
                'lastName' => $users_table->lastname,
                'role' => $users_table->role,
                'accessToken' => $users_table->accessToken,
            ],
        ];

        if (!is_null(User::where('email', $users_table->email)->first())) {
            $request->err_callback['message'] = "Your email address is already exist! Input another email address please.";
        }

        if (!is_null(User::where('username', $users_table->username)->first())) {
            $request->err_callback['message'] = "Your username is already exist! Input another username please.";
        }

        if ($users_table->save()) {
            $response = [
                'status' => 'success',
                'message' => 'ok',
                'data' => [
                    'id' => $users_table->id,
                    'username' => $users_table->username,
                    'email' => $users_table->email,
                    'firstName' => $users_table->firstname,
                    'lastName' => $users_table->lastname,
                    'role' => $users_table->role,
                    'accessToken' => $users_table->accessToken,
                ],
            ];
        }

        return $response;
    }
    public function logout(Request $request)
    {
        Auth::logout();
        return redirect("/");
    }
    public function view(Request $request)
    {
        $token = $request->input('accessToken');
        return view('index', ['accessToken' => $token]);
    }
}

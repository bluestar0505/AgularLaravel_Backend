<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Str;

class UserController extends BaseController
{
    /**
     * @param Request $request
     * @return mixed
     */
    public function getCurrentUserDetails(Request $request)
    {

        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', $accessToken)->first();

        if (!is_null($user)) {
            $status = 'success';
            $message = 'ok';
        } else {
            $status = 'fail';
            $message = 'Getting current user details is failed!';
        }
        $response = [
            'status' => $status,
            'message' => $message,
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'role' => $user->role,
                'accessToken' => $user->accessToken,
            ],
        ];
        //Later,redirecting parts would be added...
        return $response;

    }

    public function updateCurrentUser(Request $request)
    {

        $accessToken = $request->input('accessToken');
        $user = User::where('accessToken', '=', $accessToken)->first();

        if (isset($user)) {
            $user->username = $request->input('username');
            $user->email = $request->input('email');
            $user->firstname = $request->input('firstname');
            $user->lastname = $request->input('lastname');
            $user->updated_at = date("Y-m-d h:m:s");
            if ($request->input('password') != '') {
                $user->password = bcrypt($request->input('password'));
            }

        }

        $request->err_callback = ['status' => 'fail',
            'message' => 'Updating current user is failed!',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'role' => $user->role,
                'accessToken' => $user->accessToken,
            ]];

        if ($user->save()) {
            $status = 'success';
            $message = 'ok';
        }

        $response = [
            'status' => $status,
            'message' => $message,
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'role' => $user->role,
                'accessToken' => $user->accessToken,
            ],
        ];
        //Later,redirecting parts would be added...
        return $response;
    }

    public function index(Request $request)
    {

        $accessToken = $request->input('accessToken');

        $user = User::where('accessToken', $accessToken)->first();

        $userlists = [];

        if (!is_null($user)) {
            $status = 'success';
            $message = 'ok';
            $userlists = User::orderBy('username', 'asc')->get();
        } else {
            $status = 'fail';
            $message = 'Getting user lists is failed!';
        }
        $response = [
            'status' => $status,
            'message' => $message,
            'data' => $userlists,
        ];
        //Later,redirecting parts would be added...*/
        return $response;
    }

    //OK
    public function store(Request $request)
    {
        $accessToken = $request->input('accessToken');
        $me = User::where('accessToken', '=', $accessToken)->first();
        if (is_null($me) || $me->role != 'admin') {
            $res = ['status' => 'fail', 'message' => 'Your permission is not to allowed!', 'data' => ''];
            return $res;
        }

        $user = new User();
        $date = date('y-m-d h:i:s');
//        $user->id = $request->input('email')."simba".Str::random(5);

        $user->username = $request->input('username');
        $user->password = bcrypt($request->input('password'));
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->role = $request->input('role') == '' ? "user" : $request->input('role');
        $user->created_at = date("Y-m-d h:m:s");
        $user->updated_at = date("Y-m-d h:m:s");
        $user->accessToken = Str::random(60);

        $r_data = [

            'username' => $user->username,
            'email' => $user->email,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'role' => $user->role,
        ];
        $response = [
            'status' => 'fail',
            'message' => 'New user registeration is failed!',
            'data' => $r_data,
        ];
        $request->err_callback = $response;

        if (!is_null(User::where('email', $user->email)->first())) {
            $request->err_callback['message'] = "Email address is already exist! Input another email address please.";
        }

        if (!is_null(User::where('username', $user->username)->first())) {
            $request->err_callback['message'] = "Username is already exist! Input another username please.";
        }

        if ($user->save()) {
            $response = [
                'status' => 'success',
                'message' => 'ok',
                'data' => $user,
            ];
        }

        return $response;

    }

    public function update(Request $request, $id)
    {
        $accessToken = $request->input('accessToken');
        $me = User::where('accessToken', '=', $accessToken)->first();
        if (is_null($me) || $me->role != 'admin') {
            $res = ['status' => 'fail', 'message' => 'Your permission is not to allowed!', 'data' => ''];
            return $res;
        }

        $user = User::find($id);

        if (isset($user)) {
            $user->username = $request->input('username');
            $user->email = $request->input('email');
            $user->firstname = $request->input('firstname');
            $user->lastname = $request->input('lastname');
            $user->role = $request->input('role') == '' ? "user" : $request->input('role');
            $user->updated_at = date("Y-m-d h:m:s");
            if ($request->input('password') != '') {
                $user->password = bcrypt($request->input('password'));
            }

        }
        $r_data = [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'role' => $user->role,
        ];

        $request->err_callback = ['status' => 'fail',
            'message' => 'Updating user is failed!',
            'data' => $r_data];

        if ($user->save()) {
            $status = 'success';
            $message = 'ok';
        }

        $response = [
            'status' => $status,
            'message' => $message,
            'data' => $r_data,
        ];
        return $response;
    }

    //
    public function destroy(Request $request, $id)
    {
        $accessToken = $request->input('accessToken');
        $me = User::where('accessToken', '=', $accessToken)->first();
        if (is_null($me) || $me->role != 'admin') {
            $res = ['status' => 'fail', 'message' => 'Your permission is not to allowed!', 'data' => ''];
            return $res;
        }

        if (User::find($id)->delete()) {
            return ['status' => 'success', 'message' => ''];
        } else {
            return ['status' => 'fail', 'message' => 'Sorry, You cannot delete this user.'];
        }

    }

}

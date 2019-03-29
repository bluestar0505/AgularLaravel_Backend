<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;

class VerifyAccessToken
{

    public function handle($request, Closure $next)
    {

        $token = $request->input('accessToken');
        if (is_null($token)) {
            return redirect("/");
        }

        $user = User::where('accessToken', $token)->first();

        if (isset($user)) {
            $response = $next($request);
            return $response;
        }
        return redirect("/");
    }
}

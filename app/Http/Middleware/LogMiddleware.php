<?php

namespace App\Http\Middleware;

use App\Models\Log;
use Auth;
use Closure;

class LogMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if (Auth::user()) {
            $id = Auth::user()->id;
            Log::create(['user_id' => $id, 'created_at' => date("Y-m-d H:i:s")]);
        }
        return $response;
    }
}

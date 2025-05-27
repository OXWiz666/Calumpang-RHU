<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;

class AdminOrGuest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(!Auth::check() || (Auth::check() && Auth::user()->roleID == 7)){
            // if($jwt = $request->cookie('jwt')){
            //     $request->header->set('Authorization','Bearer '.$jwt);
            // }
            return $next($request);
        }
        return app(AuthController::class)->getRedirectRoute();
    }
}
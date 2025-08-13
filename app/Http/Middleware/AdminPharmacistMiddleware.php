<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;

class AdminPharmacistMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // public function handle(Request $request, Closure $next): Response
    // {
    //     if(Auth::check()){
    //         if(Auth::user()->roleID == 6 || Auth::user()->roleID == 7){
    //             return $next($request);
    //         }
    //         //return app(AuthController::class)->getRedirectRoute();
    //     }
    //     return app(AuthController::class)->getRedirectRoute();
    // }
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return app(AuthController::class)->getRedirectRoute();
        }

        // Define allowed roles (consider using constants in a proper location)
        $allowedRoles = [6, 7];

        // Check if user has required role
        if (in_array(Auth::user()->roleID, $allowedRoles)) {
            return $next($request);
        }

        // Redirect unauthorized users
        return app(AuthController::class)->getRedirectRoute();
    }
}
